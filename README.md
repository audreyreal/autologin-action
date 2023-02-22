# Autologin Action

A GitHub Actions for keeping your NationStates puppets alive.

## Usage

This action requires two inputs:

- A **user agent** to identify you to NationStates, as required by the NationStates API [Terms of Use](https://www.nationstates.net/pages/api.html#useragent)
- A JSON record of **credentials** of the type `Record<string, { pin?: string; password?: string; autologin?: string }>`.

To keep your credentials secret, it is recommended that you save them as a [GitHub Actions secret](https://docs.github.com/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets).

An example workflow using this action might look like:

```yaml
name: Autologin

on:
  schedule:
    - cron: "30 0 * * 5"
  workflow_dispatch:

jobs:
  autologin:
    runs-on: ubuntu-latest
    steps:
      - uses: esfalsa/autologin-action@main
        with:
          user_agent: testlandia
          credentials: ${{ secrets.CREDENTIALS }}
```

The `CREDENTIALS` secret might look like:

```json
{
  "testlandia": {
    "password": "hunter2"
  },
  "maxtopia": {
    "autologin": ".PaLDjCbjfddUyLlUrZYcmQ"
  }
}
```

## License

[GNU AGPLv3](./LICENSE)
