title: Reset Launchpad on MacOS
date: 2025-07-23 20:16:56
updated: 2025-07-23 20:16:56
tags:
- Launchpad
- Troubleshooting
categories: MacOS
---

Before MacOS 15.5, resetting Launchpad was a straightforward process using the Terminal command:

```bash
defaults write com.apple.dock ResetLaunchPad -bool true; killall Dock
```

However, starting with MacOS 15.5, this command no longer works as expected. If you find that Launchpad is not functioning correctly or you want to reset it to its default state, you can follow these steps:

```bash
sudo find 2>/dev/null /private/var/folders/ -type d -name com.apple.dock.launchpad -exec rm -rf {} +; killall Dock
```

### Steps to Reset Launchpad
To reset Launchpad on macOS Sequoia, follow these steps:

1. **Open Terminal**: Find Terminal in Applications > Utilities or use Spotlight to search for it.
2. **Enter Command**: Type the following command and press Enter:
   ```
   sudo find 2>/dev/null /private/var/folders/ -type d -name com.apple.dock.launchpad -exec rm -rf {} +; killall Dock
   ```
   - You'll need to enter your administrator password when prompted.
3. **Verify Reset**: Open Launchpad to check if it has reset, with Apple's default apps on the first page.

**Note**: This method requires administrator privileges and may not fully rearrange third-party apps alphabetically, but it should reset Apple's default apps effectively.