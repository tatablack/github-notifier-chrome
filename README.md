# github-notifier

GitHub Notifier is a Chrome extension able to receive notifications from a [GitHub Listener](https://github.com/tatablack/github-listener).

Its intended purpose is to make code reviews easier, for example by notifying people every time they are @mentioned in a commit message, and providing one-click access to the commit diff. It can also be used to follow the stream of commits inside a team, to focus on a particular project.

Currently, only commit notifications are supported (server-side limitation).

The extension adds a button to the browser's toolbar, which will show the number of notifications currently awaiting the user's attention, and will show them in a popup when clicked:

![Notifications popup](./images/popup.png "Notifications popup")

Every notification in the popup shows (from left to right):

- the author's avatar image;
- three numeric indicators, reflecting the number of files added, modified or deleted in that commit;
- the commit message (highlighted in red if the user was explicitly @mentioned);
- the repository to which this commit was pushed;
- the author and relative time of the commit.

For every commit, it is possible to dismiss the notification (by clicking on the trashcan icon), to click on it in order to see the diff (this would open the GitHub commit page), click the repository name to go the repository home page, and mark the notification as Reviewed (by clicking on the notepad icon).

The Options panel allows to configure the current user's GitHub username, the URL to the GitHub Listener instance which will provide notifications about commits, and then any number of usernames which the user wants to "follow" - adding them allows to receive notifications every time they push a commit, even if the user was not explicitly @mentioned in its message.

![Options panel](./images/options.png "Notifications Options panel")
