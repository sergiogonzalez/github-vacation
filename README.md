# GitHub Vacation

Everybody needs a rest, even developers. GitHub Vacation will automatically deal with the pull requests that are opened on your repositories by adding a comment and, optionally, closing the pull request. This can be used to mention somebody else on the team to take care of the pull or let the developer know when you'll be able to review the pull.

GitHub Vacation uses GitHub Webhooks to be notified when a pull request is opened in your repository. Then [@github-vacation](https://github.com/github-vacation) will check if you are in vacation mode for that repo, and if so, will comment and/or close the pull request automatically for you.

## Configuring GitHub Vacation

GitHub Vacation can configure the GitHub Webhook and add the user github-vacation as a collaborator in your repository automatically for you. First time that you sign in in [GitHub Vacation](https://github-vacation.wedeploy.io) you will be asked to grant permission to GitHub Vacation so it can add the webhook and the github-vacation collaborator in your repository when you activate vacation mode. 

GitHub Vacation uses the following GitHub OAuth scopes to perform the configuration actions in the repository: 
* user:email - Obtain user email address to identify it in our system and save the vacation mode.
* write:repo_hook - Add the Webhook in the repository when vacation mode is enabled.
* repo - Add the @github-vacation user as a collaborator in the repository when vacation mode is enabled.

### Manual Settings

However, if you don't want to grant this permission to GitHub Vacation that's ok too, but in this case you will need to [manually add the Webhook](https://developer.github.com/webhooks/creating/) and the github-vacation as a collaborator in your repository.

#### Webhook settings:
* Payload URL: https://github-vacation.wedeploy.io/close_pull
* Content Type: application/json
* Events: Pull Request

#### GitHub Vacation Collaborator:
You will need to add the user [@github-vacation](https://github.com/github-vacation) as a collaboration in your repository with write access to it can comment and close pull requests.
