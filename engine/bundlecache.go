package engine

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/evanw/esbuild/pkg/api"
	"github.com/sirupsen/logrus"
)

// bundleCacheEntry holds bundled output alongside the source file's modification time.
type bundleCacheEntry struct {
	modTime time.Time
	data    []byte
}

// bundleCache is an in-memory cache for esbuild-bundled JS/JSX files,
// keyed by absolute file path. Results are invalidated when the file's
// modification time changes.
type bundleCache struct {
	mu      sync.RWMutex
	entries map[string]bundleCacheEntry
}

func newBundleCache() *bundleCache {
	return &bundleCache{entries: make(map[string]bundleCacheEntry)}
}

// needsBundling reports whether the JS/JSX source requires full bundling,
// i.e. it contains ES module import statements or CommonJS require() calls.
func needsBundling(data []byte) bool {
	return bytes.Contains(data, []byte("import ")) ||
		bytes.Contains(data, []byte("import(")) ||
		bytes.Contains(data, []byte("require("))
}

// bundleFile bundles the given JS/JSX file using esbuild (IIFE, browser target,
// minified) and caches the result in memory. Subsequent calls return the cached
// output as long as the file's modification time has not changed.
//
// If srcData is non-nil it is passed directly to esbuild via stdin, avoiding a
// second disk read when the caller has already loaded the source. The working
// directory is always set to the file's parent directory so that esbuild can
// resolve node_modules relative to the source file.
func (ac *Config) bundleFile(filename string, srcData []byte) ([]byte, error) {
	info, err := os.Stat(filename)
	if err != nil {
		return nil, err
	}
	modTime := info.ModTime()

	bc := ac.bundleCache
	bc.mu.RLock()
	entry, ok := bc.entries[filename]
	bc.mu.RUnlock()
	if ok && entry.modTime.Equal(modTime) {
		return entry.data, nil
	}

	dir := filepath.Dir(filename)
	opts := api.BuildOptions{
		Bundle:            true,
		Platform:          api.PlatformBrowser,
		Format:            api.FormatIIFE,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		Charset:           api.CharsetUTF8,
		Write:             false,
		AbsWorkingDir:     dir,
		LogLevel:          api.LogLevelSilent,
	}
	if srcData != nil {
		// Choose the loader based on file extension so JSX syntax is handled.
		loader := api.LoaderJS
		if strings.HasSuffix(strings.ToLower(filename), ".jsx") {
			loader = api.LoaderJSX
		}
		opts.Stdin = &api.StdinOptions{
			Contents:   string(srcData),
			ResolveDir: dir,
			Sourcefile: filename,
			Loader:     loader,
		}
	} else {
		opts.EntryPoints = []string{filename}
	}

	result := api.Build(opts)

	if len(result.Errors) > 0 {
		msgs := make([]string, len(result.Errors))
		for i, e := range result.Errors {
			msgs[i] = e.Text
		}
		return nil, fmt.Errorf("bundle %s: %s", filepath.Base(filename), strings.Join(msgs, "; "))
	}

	if len(result.OutputFiles) == 0 {
		return nil, fmt.Errorf("bundle %s: no output produced", filepath.Base(filename))
	}

	data := result.OutputFiles[0].Contents

	bc.mu.Lock()
	bc.entries[filename] = bundleCacheEntry{modTime: modTime, data: data}
	bc.mu.Unlock()

	logrus.Debugf("bundled %s (%d bytes, cached)", filepath.Base(filename), len(data))
	return data, nil
}
