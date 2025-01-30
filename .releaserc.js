
module.exports = {
  repositoryUrl: 'https://github.com/rubenvitt/ember-rescue',
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: ['💥'],
          minor: ['✨'],
          patch: ['🐛', '🚑', '🔒', '🧹'],
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
    [
      '@semantic-release/exec',
      {
        prepareCmd: [
          'jq \'.version="${nextRelease.version}"\' frontend/src-tauri/tauri.conf.json > frontend/src-tauri/tauri.conf.json.tmp && mv frontend/src-tauri/tauri.conf.json.tmp frontend/src-tauri/tauri.conf.json',
          'jq \'.version="${nextRelease.version}"\' frontend/package.json > frontend/package.json.tmp && mv frontend/package.json.tmp frontend/package.json',
          'jq \'.version="${nextRelease.version}"\' backend/package.json > backend/package.json.tmp && mv backend/package.json.tmp backend/package.json',
          'jq \'.version="${nextRelease.version}"\' shared/package.json > shared/package.json.tmp && mv shared/package.json.tmp shared/package.json',
        ].join(' && '),
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'CHANGELOG.md',
          'frontend/src-tauri/tauri.conf.json',
          'frontend/package.json',
          'backend/package.json',
          'shared/package.json',
        ],
        message: '🔖 chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'CHANGELOG.md',
          'frontend/src-tauri/target/release/**/*.dmg',
          'frontend/src-tauri/target/release/**/*.AppImage',
          'frontend/src-tauri/target/release/**/*.msi',
        ],
        releaseAssets: true,
      },
    ],
  ],
};