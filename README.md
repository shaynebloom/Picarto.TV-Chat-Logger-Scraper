# Picarto.TV-Chat-Logger-Scraper

## Motivation

## Installation and usage
Copy the file into a TamperMonkey script, then change the "@match" line to have whatever channel URL you would like to log

Type "/download" (without sending) in message box to prompt download for chat log.

## Roadmap
- Store messages as array of stringified objects instead of stringifying the entire array.  Would allow quicker more efficient reading and eliminate unecessary parsing/stringifying
- Store message ID seperately for only the last stored message to save space since only the last message ID is every used
- Some additional parsing needed

## Authors
Coded by Shayne Bloom.
