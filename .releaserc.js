const path = require('path');

module.exports = {
  repositoryUrl: 'https://github.com/rubenvitt/ember-rescue',
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: ['💥'],
          minor: ['✨'],
          patch: ['🐛', '🚑', '🔒'],
        },
        releaseNotes: {
          template: `{{#if compareUrl}}
# Version [v{{nextRelease.version}}]({{compareUrl}}) veröffentlicht am {{datetime "UTC:yyyy-mm-dd"}}
{{else}}
# Version v{{nextRelease.version}} veröffentlicht am {{datetime "UTC:yyyy-mm-dd"}}
{{/if}}

{{#with commits}}
{{#if sparkles}}
## ✨ Neue Funktionen
Die folgenden neuen Features wurden hinzugefügt:
{{#each sparkles}}
- {{> commitTemplate}}
{{/each}}
{{/if}}

{{#if bug}}
## 🐛 Fehlerbehebungen
Diese Probleme wurden behoben:
{{#each bug}}
- {{> commitTemplate}}
{{/each}}
{{/if}}

{{#if ambulance}}
## 🚑 Hotfixes
Dringende Hotfixes:
{{#each ambulance}}
- {{> commitTemplate}}
{{/each}}
{{/if}}

{{#if lock}}
## 🔒 Sicherheitsverbesserungen
Sicherheitsrelevante Änderungen:
{{#each lock}}
- {{> commitTemplate}}
{{/each}}
{{/if}}

{{#if boom}}
## 💥 Breaking Changes
Bitte beachten Sie die folgenden Änderungen, die möglicherweise zu Anpassungen führen:
{{#each boom}}
- {{> commitTemplate}}
{{/each}}
{{/if}}
{{/with}}`,
          partials: {
            commitTemplate: `[\`{{commit.short}}\`](https://github.com/{{owner}}/{{repo}}/commit/{{commit.short}}) {{subject}} 
{{#if issues}}(Zugehörige Issues: {{#each issues}}[\`{{text}}\`]({{link}}){{#unless @last}}, {{/unless}}{{/each}}){{/if}}
{{#if wip}}
WIP Änderungen:
{{#each wip}}
- [\`{{commit.short}}\`](https://github.com/{{owner}}/{{repo}}/commit/{{commit.short}}) {{subject}}
{{/each}}
{{/if}}`,
          },
          helpers: {
            datetime: function(format = 'dd.mm.yyyy') {
              const date = new Date();
              const utcDate = new Date(date.toUTCString().slice(0, -4)); // remove timezone info
              return format
                .replace('yyyy', utcDate.getUTCFullYear())
                .replace('mm', String(utcDate.getUTCMonth() + 1).padStart(2, '0'))
                .replace('dd', String(utcDate.getUTCDate()).padStart(2, '0'));
            },
          },
          issueResolution: {
            template: '{baseUrl}/{owner}/{repo}/issues/{ref}',
            baseUrl: 'https://github.com',
            source: 'github.com',
            removeFromCommit: false,
            regex: /#\d+/g,
          },
        },
      },
    ],
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    // [
    //   '@semantic-release/github',
    //   {
    //     assets: [
    //       'CHANGELOG.md',
    //       'RELEASE_NOTES.md',
    //       'frontend-artifacts/**/*.dmg',
    //       'frontend-artifacts/**/*.AppImage',
    //       'frontend-artifacts/**/*.msi',
    //     ],
    //   },
    // ],
  ],
};