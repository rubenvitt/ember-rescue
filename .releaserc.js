/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: 'https://github.com/rubenvitt/ember-rescue',
  plugins: [
    [
      'semantic-release-gitmoji',
      {
        releaseRules: {
          major: ['💥'],
          minor: ['✨', '🚀'],
          patch: ['🐛', '🚑', '🔒', '🧹', '♻️', '🔧', '📦', '📝', '💄', '⚡', '🗑', '🛠'],
        },
        releaseNotes: {
          template: `{{#if compareUrl}}
## Version [v{{nextRelease.version}}]({{compareUrl}}) – Veröffentlicht am {{datetime "yyyy-mm-dd"}}
{{else}}
## Version v{{nextRelease.version}} – Veröffentlicht am {{datetime "yyyy-mm-dd"}}
{{/if}}

{{#with commits}}

## ✨ Verbesserungen & neue Features
{{#if sparkles}}Neue Funktionen:{{/if}}
{{#if rocket}}Deployment-Optimierungen:{{/if}}
{{#each sparkles}}
- {{> commitTemplate}}
{{/each}}
{{#each rocket}}
- {{> commitTemplate}}
{{/each}}

## 🐛 Fehlerbehebungen & Sicherheit
{{#if bug}}Behobene Bugs:{{/if}}
{{#if ambulance}}Dringende Hotfixes:{{/if}}
{{#if lock}}Sicherheitsupdates:{{/if}}
{{#each bug}}
- {{> commitTemplate}}
{{/each}}
{{#each ambulance}}
- {{> commitTemplate}}
{{/each}}
{{#each lock}}
- {{> commitTemplate}}
{{/each}}

## 🛠 Code & Wartung
{{#if broom}}Codebereinigungen:{{/if}}
{{#if recycle}}Refactoring:{{/if}}
{{#if wrench}}Tooling-Verbesserungen:{{/if}}
{{#if wastebasket}}Entfernte Features:{{/if}}
{{#each broom}}
- {{> commitTemplate}}
{{/each}}
{{#each recycle}}
- {{> commitTemplate}}
{{/each}}
{{#each wrench}}
- {{> commitTemplate}}
{{/each}}
{{#each wastebasket}}
- {{> commitTemplate}}
{{/each}}

## 📦 Abhängigkeiten & Performance
{{#if package}}Updates von Paketen:{{/if}}
{{#if zap}}Performance-Verbesserungen:{{/if}}
{{#each package}}
- {{> commitTemplate}}
{{/each}}
{{#each zap}}
- {{> commitTemplate}}
{{/each}}

## 📝 Sonstiges
{{#if memo}}Dokumentationsupdates:{{/if}}
{{#if lipstick}}UI-Anpassungen:{{/if}}
{{#each memo}}
- {{> commitTemplate}}
{{/each}}
{{#each lipstick}}
- {{> commitTemplate}}
{{/each}}

## 💥 Breaking Changes
{{#each boom}}
- {{> commitTemplate}}
{{/each}}

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
        successCmd: 'cat RELEASE_NOTES.md >> $GITHUB_STEP_SUMMARY && echo "$(cat RELEASE_NOTES.md)\n\n$(cat RELEASE.md)" > RELEASE.md'
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
          'RELEASE.md'
        ],
        message: '🔖(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [
          'CHANGELOG.md',
          'frontend-artifacts/**/*.dmg',
          'frontend-artifacts/**/*.AppImage',
          'frontend-artifacts/**/*.msi',
        ],
        releaseAssets: true,
        releaseNotesFile: 'RELEASE.md'
      },
    ],
  ],
};