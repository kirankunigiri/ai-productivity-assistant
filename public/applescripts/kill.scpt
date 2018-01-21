set siteList to {"https://www.producthunt.com/", "https://www.facebook.com/", "https://www.reddit.com/", "https://www.youtube.com/", "https://twitter.com/"}
repeat with site in siteList
	tell application "Google Chrome"
		set windowList to (every tab of every window whose URL starts with site)
		repeat with tabList in windowList
			set tabList to tabList as any
			repeat with tabItr in tabList
				set tabItr to tabItr as any
				delete tabItr
			end repeat
		end repeat
	end tell
end repeat