---
name: react-navigation
description: Provides React Navigation UI patterns for stacks, tabs, drawers etc. Use when building navigation UIs with React Navigation, configuring headers, bottom sheets or handling safe areas and insets.
license: MIT
metadata:
  author: Callstack
  tags: react-navigation, navigation, ui, native-stack, header, bottom-tabs, native-bottom-tabs, material-top-tabs, drawer, form-sheet, status-bar, safe-area, nested-navigators
---

# React Navigation

## Overview

Guide for building navigation UIs with React Navigation.

This skill only applies to React Navigation 7. The API and patterns may not work with different versions.

## API Selection

React Navigation offers two API - object-based `Static API` and component-based `Dynamic API`.

- **Existing Apps**: Check the current navigation setup and follow the same API style when using the references
- **New Apps**: If the app does not have an existing navigation setup yet, prefer `Static API`

## When to Apply

Reference this skill when:

- Building navigation UI patterns such as stacks, tabs, drawers, sheets etc.
- Configuring headers and other built-in navigator UI
- Handling safe areas and insets in navigation UI

## References

| File                                        | Description                    |
| ------------------------------------------- | ------------------------------ |
| [stacks.md][stacks]                         | Stack based navigation         |
| [form-sheet.md][form-sheet]                 | Bottom sheet and form sheets   |
| [bottom-tabs.md][bottom-tabs]               | Cross-platform bottom tabs     |
| [native-bottom-tabs.md][native-bottom-tabs] | Native bottom tabs             |
| [material-top-tabs.md][material-top-tabs]   | Swipeable Top tabs             |
| [drawers.md][drawers]                       | Drawer navigation and sidebars |
| [header.md][header]                         | Configuring headers            |
| [safe-areas.md][safe-areas]                 | Safe-area handling             |

## Problem -> Skill Mapping

| Problem                                                                   | Start With                                  |
| ------------------------------------------------------------------------- | ------------------------------------------- |
| Showing screens and modals in a stack                                     | [stacks.md][stacks]                         |
| Showing bottom sheets or form sheets                                      | [form-sheet.md][form-sheet]                 |
| Showing screens in bottom tabs or responsive sidebars with web support    | [bottom-tabs.md][bottom-tabs]               |
| Showing screens in native tabs on iOS & Android                           | [native-bottom-tabs.md][native-bottom-tabs] |
| Showing content in swipeable top tabs                                     | [material-top-tabs.md][material-top-tabs]   |
| Using a drawer or sidebar                                                 | [drawers.md][drawers]                       |
| Configuring the header in bottom tab or drawer navigator                  | [header.md][header]                         |
| Handling safe-area such as status bar, header insets, tab bar insets etc. | [safe-areas.md][safe-areas]                 |

[stacks]: references/stacks.md
[form-sheet]: references/form-sheet.md
[safe-areas]: references/safe-areas.md
[bottom-tabs]: references/bottom-tabs.md
[native-bottom-tabs]: references/native-bottom-tabs.md
[material-top-tabs]: references/material-top-tabs.md
[drawers]: references/drawers.md
[header]: references/header.md
