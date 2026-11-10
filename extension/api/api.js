/* DRAFT — не проверено в живом Thunderbird.
 * Черновик Experiment API для GlowMail: разворачивает chrome/userChrome.css
 * и chrome/icons/*.svg из архива дополнения в папку chrome/ профиля, чтобы
 * обновления прилетали сами после публикации на addons.thunderbird.net.
 * Паттерн — thunderbird-fluent (Thunderbird 153 ESR): один аддон, который
 * сам пишет CSS в профиль; развёртывание привязано к версии дополнения.
 *
 * Проверенные правила из их документации, которые здесь учтены:
 * - в песочнице Experiment API нет fetch — чтение файлов через NetUtil;
 *   доступны IOUtils, PathUtils, Components;
 * - развёртывание version-gated: если версия дополнения равна уже
 *   развёрнутой (pref extensions.glowmail.deployedVersion) — ранний выход,
 *   иначе правки под chrome/ и icons/ не дойдут до профиля;
 * - Gecko читает папку chrome/ во время запуска, поэтому развёртывание
 *   вступает в силу только при СЛЕДУЮЩЕМ запуске;
 * - при обновлении (install-over) листы удалять нельзя: deploy идёт после
 *   старта, а удаление оставило бы следующую сессию вообще без темы;
 * - toolkit.legacyUserProfileCustomizations.stylesheets ставится только
 *   если у настройки не было пользовательского значения, и только такие
 *   настройки откатываются при удалении.
 * Перед публикацией на ATN обязательно: тестовая установка временного
 * дополнения (about:debugging) и проверка, что файлы легли в профиль.
 */

/* global ChromeUtils, Components, ExtensionCommon, Services */

const { ExtensionCommon } = ChromeUtils.importESModule(
  "resource://gre/modules/ExtensionCommon.sys.mjs"
);

const PREF_DEPLOYED_VERSION = "extensions.glowmail.deployedVersion";
const PREF_STYLESHEETS = "toolkit.legacyUserProfileCustomizations.stylesheets";

class GlowMailAPI extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    const { extension } = context;
    const self = this;
    return {
      glowmail: {
        async deploy() {
          const version = extension.version;
          const branch = Services.prefs.getBranch("");
          let deployed = "";
          try {
            deployed = branch.getCharPref(PREF_DEPLOYED_VERSION);
          } catch (e) {
            deployed = "";
          }
          if (deployed === version) {
            return version; // уже развёрнуто, ничего не делаем
          }

          // Список файлов генерирует tools/pack-extension.py из glob,
          // чтобы добавление CSS-модуля или SVG не требовало правок кода.
          const fileList = await self._readJSON(
            extension,
            "chrome-files.json"
          );

          const profileDir = PathUtils.profileDir;
          const chromeDir = PathUtils.join(profileDir, "chrome");
          await IOUtils.makeDirectory(chromeDir, { ignoreExisting: true });
          await IOUtils.makeDirectory(PathUtils.join(chromeDir, "icons"), {
            ignoreExisting: true,
          });
          await IOUtils.makeDirectory(PathUtils.join(chromeDir, "fonts"), {
            ignoreExisting: true,
          });

          for (const rel of fileList) {
            const src = PathUtils.join(
              extension.rootURI.spec,
              "chrome",
              ...rel.split("/")
            );
            const dest = PathUtils.join(chromeDir, ...rel.split("/"));
            const bytes = await self._readFile(src);
            await IOUtils.write(dest, bytes);
          }

          // Включаем userChrome один раз, только если пользователь сам
          // не трогал эту настройку.
          if (!branch.prefHasUserValue(PREF_STYLESHEETS)) {
            branch.setBoolPref(PREF_STYLESHEETS, true);
            branch.setBoolPref(
              "extensions.glowmail.ownsStylesheetsPref",
              true
            );
          }

          branch.setCharPref(PREF_DEPLOYED_VERSION, version);
          return version;
        },
      },
    };
  }

  // Чтение файла из архива дополнения без fetch (его в песочнице нет).
  async _readFile(uri) {
    return new Promise((resolve, reject) => {
      const { NetUtil } = ChromeUtils.importESModule(
        "resource://gre/modules/NetUtil.sys.mjs"
      );
      NetUtil.asyncFetch(
        { uri, loadUsingSystemPrincipal: true },
        (inputStream, status) => {
          if (!Components.isSuccessCode(status)) {
            reject(new Error("Cannot read " + uri + ": " + status));
            return;
          }
          const data = NetUtil.readInputStreamToString(
            inputStream,
            inputStream.available()
          );
          resolve(new TextEncoder().encode(data));
        }
      );
    });
  }

  async _readJSON(extension, name) {
    const bytes = await this._readFile(
      PathUtils.join(extension.rootURI.spec, name)
    );
    return JSON.parse(new TextDecoder().decode(bytes));
  }
}
