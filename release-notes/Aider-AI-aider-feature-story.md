# Aider-AI/aider Evolution: A Feature Story

This document presents a chronological story of Aider-AI/aider's evolution, highlighting major features, breaking changes, and deprecations across versions.

## Version 0.67.0 (December 6, 2024)

### Major Features & Improvements
- Spinner now falls back to ASCII art if fancy symbols throw unicode errors.
- `--read` now expands `~` home dirs.
- Enabled exception capture in analytics.
- [Aider wrote 61% of the code in this release.](https://aider.chat/HISTORY.html)

## Version 0.66.0 (December 1, 2024)

### Major Features & Improvements
- Set cwd to repo root when running shell commands.
- Improved error handling for failed .gitignore file operations.
- Improved error handling for input history file permissions.
- Improved error handling for analytics file access.
- Better handling of __version__ import errors.
- Improved `/drop` command to support substring matching for non-glob patterns.
- Aider wrote 82% of the code in this release.

### Deprecations & Removals
- Bugfix when scraping URLs found in chat messages.
- Better handling of __version__ import errors.
- Improved `/drop` command to support substring matching for non-glob patterns.
- Bugfix to `--alias`.
- Aider wrote 82% of the code in this release.

## Version 0.65.0 (November 26, 2024)

### Major Features & Improvements
- Ollama models now default to an 8k context window.
- Ask 2.5% of users if they want to opt-in to [analytics](https://aider.chat/docs/more/analytics.html).
- Skip suggesting files that share names with files already in chat.
- `/editor` returns and prefill the file content into the prompt, so you can use `/editor` to compose messages that start with `/commands`, etc.
- Enhanced error handling for analytics.
- Improved handling of UnknownEditFormat exceptions with helpful documentation links.
- Bumped dependencies to pick up grep-ast 0.4.0 for Dart language support.
- Aider wrote 81% of the code in this release.

## Version 0.64.0 (November 21, 2024)

### Major Features & Improvements
- Full support for `gpt-4o-2024-11-20`.
- Stream o1 models by default.
- `/run` and suggested shell commands are less mysterious and now confirm that they "Added XX lines of output to the chat."
- Ask 1% of users if they want to opt-in to [analytics](https://aider.chat/docs/more/analytics.html).
- Improved [model settings configuration](https://aider.chat/docs/config/adv-model-settings.html#global-extra-params) with support for global `extra_params` for `litellm.completion()`.
- Architect mode now asks to add files suggested by the LLM.
- Save empty dict to cache file on model metadata download failure, to delay retry.
- Improved error handling and code formatting.
- Modified model metadata file loading to allow override of resource file.
- Allow recursive loading of dirs using `--read`.
- Updated dependency versions to pick up litellm fix for ollama models.
- Updated Qwen 2.5 Coder 32B model configuration.
- Improved error handling for git operations.
- Aider wrote 74% of the code in this release.

## Version 0.63.0 (November 13, 2024)

*No major changes documented for this version.*

## Version 0.62.0 (November 4, 2024)

*No major changes documented for this version.*

## Version 0.61.0 (November 1, 2024)

*No major changes documented for this version.*

## Version 0.60.0 (October 22, 2024)

*No major changes documented for this version.*

## Version 0.59.0 (October 4, 2024)

### Major Features & Improvements
- Renamed `--yes` to `--yes-always`.
- Config file now uses standard YAML list syntax with ` - list entries`, one per line.
- `/settings` now includes the same announcement lines that would print at launch.
- Sanity checks the `--editor-model` on launch now, same as main and weak models.
- Repo-map is deterministic now, with improved caching logic.
- Improved commit message prompt.
- Aider wrote 77% of the code in this release.

## Version 0.58.0 (September 29, 2024)

*No major changes documented for this version.*

## Version 0.57.0 (September 21, 2024)

### Major Features & Improvements
- Numerous bug fixes for corner case crashes.
- Updated all dependency versions.
- Aider wrote 70% of the code in this release.

### Deprecations & Removals
- Numerous bug fixes for corner case crashes.
- Updated all dependency versions.
- Aider wrote 70% of the code in this release.

## Version 0.56.0 (September 9, 2024)

*No major changes documented for this version.*

## Version 0.55.0 (September 4, 2024)

### Major Features & Improvements
- Disabled built in linter for typescript.
- Catch `/voice` transcription exceptions, show the WAV file so the user can recover it.
- Adopted setuptools_scm to provide `vX.Y.Z.dev` version naming with git hashes.
- Share active test and lint commands with the LLM.
- Do not fuzzy match filenames when LLM is creating a new file, by @ozapinq
- Only show cache warming status update if `--verbose`.
- Refuse to make git repo in $HOME, warn user.
- Aider wrote 53% of the code in this release.

## Version 0.54.0 (August 28, 2024)

### Major Features & Improvements
- Shell and `/run` commands can now be interactive in environments where a pty is available.
- Optionally share output of suggested shell commands back to the LLM.
- New `--[no-]suggest-shell-commands` switch to configure shell commands.
- Performance improvements for autocomplete in large/mono repos.
- New `--upgrade` switch to install latest version of aider from pypi.
- Disabled automatic reply to the LLM on `/undo` for all models.
- Aider wrote 64% of the code in this release.

### Deprecations & Removals
- Aider wrote 64% of the code in this release.

## Version 0.53.0 (August 27, 2024)

*No major changes documented for this version.*

## Version 0.52.0 (August 23, 2024)

*No major changes documented for this version.*

## Version 0.51.0 (August 20, 2024)

*No major changes documented for this version.*

## Version 0.50.0 (August 13, 2024)

### Major Features & Improvements
- Switched from `setup.py` to `pyproject.toml`, by @branchvincent.
- Bug fix to persist files added during `/ask`.
- Bug fix for chat history size in `/tokens`.
- Aider wrote 66% of the code in this release.

## Version 0.49.0 (August 10, 2024)

### Major Features & Improvements
- Performance improvements for repo map calculation.
- `/tokens` now shows the active model.
- Enhanced commit message attribution options:
- Worked around litellm bug that removes OpenRouter app headers when using `extra_headers`.
- Improved progress indication during repo map processing.
- Aider wrote 61% of the code in this release.

### Deprecations & Removals
- Aider wrote 61% of the code in this release.

## Version 0.48.0 (August 6, 2024)

### Major Features & Improvements
- New `/add-clipboard-image` to add images to the chat from your clipboard.
- Use `--map-tokens 1024` to use repo map with any model.
- Support for Sonnet's 8k output window.
- Workaround litellm bug for retrying API server errors.
- Upgraded dependencies, to pick up litellm bug fixes.
- Aider wrote 44% of the code in this release.

## Version 0.47.0 (July 31, 2024)

### Major Features & Improvements
- Generic auto-completions are provided for `/commands` without a completion override.
- Fixed broken OCaml tags file.
- Aider wrote 58% of the code in this release.

## Version 0.46.0 (July 29, 2024)

*No major changes documented for this version.*

## Version 0.45.0 (July 18, 2024)

*No major changes documented for this version.*

## Version 0.44.0 (July 16, 2024)

### Major Features & Improvements
- Improved regex for detecting URLs in user chat messages.
- Simplified output of `--models`.
- The `--check-update` switch was renamed to `--just-check-updated`.
- The `--skip-check-update` switch was renamed to `--[no-]check-update`.
- Aider wrote 29% of the code in this release (157/547 lines).

## Version 0.43.0 (July 7, 2024)

*No major changes documented for this version.*

## Version 0.42.0 (July 4, 2024)

*No major changes documented for this version.*

## Version 0.41.0 (July 1, 2024)

### Major Features & Improvements
- Fixed regression in quality of one-line commit messages.
- Automatically retry on Anthropic `overloaded_error`.
- Bumped dependency versions.

## Version 0.40.0 (June 24, 2024)

*No major changes documented for this version.*

## Version 0.39.0 (June 20, 2024)

*No major changes documented for this version.*

## Version 0.38.0 (June 17, 2024)

*No major changes documented for this version.*

## Version 0.37.0 (June 4, 2024)

*No major changes documented for this version.*

## Version 0.36.0 (May 22, 2024)

*No major changes documented for this version.*

## Version 0.35.0 (May 13, 2024)

### Major Features & Improvements
- Improved reflection feedback to LLMs using the diff edit format.
- Improved retries on `httpx` errors.

## Version 0.34.0 (May 10, 2024)

*No major changes documented for this version.*

## Version 0.33.0 (May 8, 2024)

*No major changes documented for this version.*

## Version 0.32.0 (May 8, 2024)

*No major changes documented for this version.*

## Version 0.31.0 (May 2, 2024)

*No major changes documented for this version.*

## Version 0.30.0 (April 24, 2024)

### Major Features & Improvements
- Allow repo map for "whole" edit format.
- Improved [model warnings](https://aider.chat/docs/llms.html#model-warnings) for unknown or unfamiliar models

## Version 0.29.0 (April 21, 2024)

### Major Features & Improvements
- New command line switches for working with popular models:
- Improved "whole" and "diff" backends to better support [Cohere's free to use Command-R+ model](https://aider.chat/docs/llms.html#cohere).
- Allow `/add` of images from anywhere in the filesystem.
- Fixed crash when operating in a repo in a detached HEAD state.
- Fix: Use the same default model in CLI and python scripting.

## Version 0.28.0 (April 10, 2024)

*No major changes documented for this version.*

## Version 0.27.0 (March 22, 2024)

*No major changes documented for this version.*

## Version 0.26.0 (March 8, 2024)

### Major Features & Improvements
- Bug fix to avoid reflecting local git errors back to GPT.
- Improved logic for opening git repo on launch.

## Version 0.25.0 (March 4, 2024)

### Major Features & Improvements
- Show the user a FAQ link if edits fail to apply.
- Made past articles part of https://aider.chat/blog/

## Version 0.24.0 (February 10, 2024)

*No major changes documented for this version.*

## Version 0.23.0 (February 3, 2024)

### Major Features & Improvements
- New `/test` command that runs a command and adds the output to the chat on non-zero exit status.
- Improved streaming of markdown to the terminal.

## Version 0.22.0 (January 23, 2024)

### Major Features & Improvements
- Autocomplete for /add and /drop now properly quotes filenames with spaces.
- The /undo command asks GPT not to just retry reverted edit.

## Version 0.21.0 (January 8, 2024)

### Major Features & Improvements
- New `--check-update` arg to check if updates are available and exit with status code.

## Version 0.20.0 (January 4, 2024)

*No major changes documented for this version.*

## Version 0.19.0 (December 20, 2023)

*No major changes documented for this version.*

## Version 0.18.1 (December 14, 2023)

*No major changes documented for this version.*

## Version 0.18.0 (November 17, 2023)

*No major changes documented for this version.*

## Version 0.17.0 (November 7, 2023)

*No major changes documented for this version.*

## Version 0.16.1 (October 31, 2023)

### Major Features & Improvements
- [Improved repository map using tree-sitter](https://aider.chat/docs/repomap.html)
- Switched from "edit block" to "search/replace block", which reduced malformed edit blocks. [Benchmarked](https://aider.chat/docs/benchmarks.html) at 66.2%, no regression.
- Improved handling of malformed edit blocks targetting multiple edits to the same file. [Benchmarked](https://aider.chat/docs/benchmarks.html) at 65.4%, no regression.

## Version 0.16.0 (October 29, 2023)

*No major changes documented for this version.*

## Version 0.15.0 (October 20, 2023)

### Major Features & Improvements
- New `--commit` cmd line arg, which just commits all pending changes with a sensible commit message geneated by gpt-3.5.
- `/run` and `/git` now accept full shell commands, like: `/run (cd subdir; ls)`
- Restored missing `--encoding` cmd line switch.

## Version 0.14.2 (October 18, 2023)

### Major Features & Improvements
- /add and /drop handle absolute filenames and quoted filenames
- /add checks to be sure files are within the git repo (or root)
- If needed, warn users that in-chat file paths are all relative to the git repo
- Fixed /add bug in when aider launched in repo subdir
- Show models supported by api/key if requested model isn't available
- [Support for Claude2 and other LLMs via OpenRouter](https://aider.chat/docs/faq.html#accessing-other-llms-with-openrouter) by @joshuavial
- Documentation for [running the aider benchmarking suite](https://github.com/paul-gauthier/aider/tree/main/benchmark)
- Aider now requires Python >= 3.9

## Version 0.14.1 (September 30, 2023)

### Major Features & Improvements
- [Support for Claude2 and other LLMs via OpenRouter](https://aider.chat/docs/faq.html#accessing-other-llms-with-openrouter) by @joshuavial
- Documentation for [running the aider benchmarking suite](https://github.com/paul-gauthier/aider/tree/main/benchmark)
- Aider now requires Python >= 3.9

## Version 0.14.0 (September 8, 2023)

*No major changes documented for this version.*

## Version 0.13.0 (August 22, 2023)

### Major Features & Improvements
- Late-bind importing `sounddevice`, as it was slowing down aider startup
- Improved --foo/--no-foo switch handling for command line and yml config settings

## Version 0.12.0 (August 11, 2023)

*No major changes documented for this version.*

## Version 0.11.1 (August 8, 2023)

### Major Features & Improvements
- Fixed bad commit message when adding new file to empty repo.
- Fixed corner case of pending chat history summarization when dirty committing.
- Fixed corner case of undefined `text` when using `--no-pretty`.
- Fixed /commit bug from repo refactor, added test coverage.
- [Benchmarked](https://aider.chat/docs/benchmarks.html) at 53.4% for gpt-3.5/whole (no regression).
- Automatically summarize chat history to avoid exhausting context window.
- More detail on dollar costs when running with `--no-stream`
- Stronger GPT-3.5 prompt against skipping/eliding code in replies (51.9% [benchmark](https://aider.chat/docs/benchmarks.html), no regression)
- Defend against GPT-3.5 or non-OpenAI models suggesting filenames surrounded by asterisks.
- Refactored GitRepo code out of the Coder class.

## Version 0.11.0 (August 2, 2023)

*No major changes documented for this version.*

## Version 0.10.1 (July 24, 2023)

### Major Features & Improvements
- Use Meta-ENTER (Esc+ENTER in some environments) to enter multiline chat messages.
- Create a `.gitignore` with `.aider*` to prevent users from accidentaly adding aider files to git.
- Check pypi for newer versions and notify user.
- Updated keyboard interrupt logic so that 2 ^C in 2 seconds always forces aider to exit.
- Provide GPT with detailed error if it makes a bad edit block, ask for a retry.
- Force `--no-pretty` if aider detects it is running inside a VSCode terminal.
- [Benchmarked](https://aider.chat/docs/benchmarks.html) at 64.7% for gpt-4/diff (no regression)

## Version 0.10.0 (July 22, 2023)

### Major Features & Improvements
- Use Meta-ENTER (Esc+ENTER in some environments) to enter multiline chat messages.
- Create a `.gitignore` with `.aider*` to prevent users from accidentaly adding aider files to git.
- Check pypi for newer versions and notify user.
- Updated keyboard interrupt logic so that 2 ^C in 2 seconds always forces aider to exit.
- Provide GPT with detailed error if it makes a bad edit block, ask for a retry.
- Force `--no-pretty` if aider detects it is running inside a VSCode terminal.
- [Benchmarked](https://aider.chat/docs/benchmarks.html) at 64.7% for gpt-4/diff (no regression)

## Version 0.9.0 (July 16, 2023)

### Major Features & Improvements
- Improved output when retrying connections to the OpenAI API
- Redacted api key from `--verbose` output
- [Benchmarked](https://aider.chat/docs/benchmarks.html) at 53.8% for gpt-3.5-turbo/whole

## Version 0.8.3 (July 12, 2023)

### Major Features & Improvements
- Install docs link to [NeoVim plugin](https://github.com/joshuavial/aider.nvim) by @joshuavial
- Reorganized the `--help` output
- Disabled general availability of gpt-4 (it's rolling out, not 100% available yet)
- Ask to create a git repo if none found, to better track GPT's code changes
- Glob wildcards are now supported in `/add` and `/drop` commands
- Pass `--encoding` into ctags, require it to return `utf-8`
- More robust handling of filepaths, to avoid 8.3 windows filenames
- ~Marked GPT-4 as generally available~
- [Benchmark comparing code editing in GPT-3.5 and GPT-4](https://aider.chat/docs/benchmarks.html)
- Improved Windows support:
- Improved handling of Unicode encoding/decoding
- Better status messages explaining the reason when ctags is disabled

## Version 0.8.2 (July 8, 2023)

### Major Features & Improvements
- Ask to create a git repo if none found, to better track GPT's code changes
- Glob wildcards are now supported in `/add` and `/drop` commands
- Pass `--encoding` into ctags, require it to return `utf-8`
- More robust handling of filepaths, to avoid 8.3 windows filenames
- ~Marked GPT-4 as generally available~
- [Benchmark comparing code editing in GPT-3.5 and GPT-4](https://aider.chat/docs/benchmarks.html)
- Improved Windows support:
- Improved handling of Unicode encoding/decoding
- Better status messages explaining the reason when ctags is disabled

## Version 0.8.1 (July 8, 2023)

### Major Features & Improvements
- Marked GPT-4 as generally available
- [Benchmark comparing code editing in GPT-3.5 and GPT-4](https://aider.chat/docs/benchmarks.html)
- Improved Windows support:
- Improved handling of Unicode encoding/decoding
- Better status messages explaining the reason when ctags is disabled

## Version 0.8.0 (July 6, 2023)

### Major Features & Improvements
- Better status messages explaining the reason when ctags is disabled

## Version 0.7.2 (June 26, 2023)

### Major Features & Improvements
- Coding competence benchmarking tool against suite of programming tasks based on Execism's python repo.
- Major refactor in preparation for supporting new function calls api.
- Initial implementation of a function based code editing backend for 3.5.
- Limit automatic retries when GPT returns a malformed edit response.
- Fixed a bug in the display of streaming diffs in GPT-3.5 chats.
- Graceful handling of context window exhaustion, including helpful tips.
- Added `--message` to give GPT that one instruction and then exit after it replies and any edits are performed.
- Added `--no-stream` to disable streaming GPT responses.
- Coding competence benchmarking tool against suite of programming tasks based on Execism's python repo.
- Major refactor in preparation for supporting new function calls api.
- Initial implementation of a function based code editing backend for 3.5.
- Limit automatic retries when GPT returns a malformed edit response.

## Version 0.7.1 (June 26, 2023)

### Major Features & Improvements
- Coding competence benchmarking tool against suite of programming tasks based on Execism's python repo.
- Major refactor in preparation for supporting new function calls api.
- Initial implementation of a function based code editing backend for 3.5.
- Limit automatic retries when GPT returns a malformed edit response.

## Version 0.7.0 (June 25, 2023)

### Major Features & Improvements
- Coding competence benchmarking tool against suite of programming tasks based on Execism's python repo.
- Major refactor in preparation for supporting new function calls api.
- Initial implementation of a function based code editing backend for 3.5.
- Limit automatic retries when GPT returns a malformed edit response.

## Version 0.6.2 (June 17, 2023)

*No major changes documented for this version.*

## Version 0.5.0 (June 8, 2023)

*No major changes documented for this version.*

