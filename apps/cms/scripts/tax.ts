/**
 * This script is used to perform bulk actions on "Taxonomies" collection types (those with "tax-" prefix and the collection type "argomento")
 *
 * Actions:
 * - config:
 * 		Overwrite content type config-sync files for "Taxonomies" (api::tax-{taxonomy_id}.tax-{taxonomy_id}).
 * 		To be used by "strapi-plugin-config-sync" (https://market.strapi.io/plugins/strapi-plugin-config-sync)
 *
 *  	This script is meant to be used to change admin view settings,
 * 		fields descriptions or labels (metadatas) and content type layouts.
 * 		Please don't use it to add or remove content type fields.
 *
 *    The collection type "argomento", being different from any other taxonomy type, is not configured via this script
 *
 * - export:
 * 		Using import-export-entries plugin, export taxonomies data in json files and save them to be versioned by this repository
 *
 * - import:
 * 		Using import-export-entries plugin, import taxonomies data from json files saved in this repository
 *
 * Getting-started:
 *    To use with import-export-entries plugin, generate a new API Token (see docs: https://docs.strapi.io/dev-docs/configurations/api-tokens)
 *    set permissions on import-export-entries exportData and importData actions.
 *    Then add PLUGIN_IMPORT_EXPORT_ENTRIES_API_TOKEN in your .env file with the API key generated
 *
 * This script can overwrite files and perform operations on the db.
 * -- "With great power comes great responsibility" - Spider-Man
 */

import dotenv from "dotenv";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import taxonomies from "../config/taxonomies";

try {
  dotenv.config();

  // variables
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT || 1337;
  const importExportEntriesApiBaseRoute = "/api/import-export-entries/content/";
  const token = process.env.PLUGIN_IMPORT_EXPORT_ENTRIES_API_TOKEN;

  if (!token) {
    throw new Error(`import-export-entries plugin API token not found.
  Please generate a new API token (see docs: https://docs.strapi.io/dev-docs/configurations/api-tokens),
  set permissions on import-export-entries exportData and improtData actions.
  Then add PLUGIN_IMPORT_EXPORT_ENTRIES_API_TOKEN in your .env file with the API key generated`);
  }

  // argument check
  const defaultArgErrMsg =
    'Please launch this script with "config", "import" or "export" command to specify the desired action';

  const arg = process.argv[2];
  const helpCommands = ["--help", "-h"];
  const configCommands = ["config", "c"];
  const importCommands = ["import", "i"];
  const exportCommands = ["export", "e"];

  const { apiBaseId, ids, exportPaths, configPaths, configs } = taxonomies;

  // set action
  let action = null;

  if (helpCommands.includes(arg)) {
    displayHelp();
  } else if (configCommands.includes(arg)) {
    action = "config";
  } else if (exportCommands.includes(arg)) {
    action = "export";

    if (!existsSync(exportPaths.path)) {
      mkdirSync(exportPaths.path, { recursive: true });
    }
  } else if (importCommands.includes(arg)) {
    action = "import";
  }

  if (!action) {
    displayHelp();
    process.exit();
  }

  // run action
  intro(action);

  ids.forEach(async (id) => {
    const apiId = id;
    const configFilePath = `${configPaths.path}${configPaths.baseName}##api##${apiId}.${apiId}.json`;
    const importExportFilePath = `${exportPaths.path}${exportPaths.baseName}${apiId}.json`;

    if (action === "config") {
      writeConfigFile(apiId, configFilePath, configs);
    } else if (action === "export") {
      exportFile(apiId, importExportFilePath);
    } else if (action === "import") {
      importFile(apiId, importExportFilePath);
    } else {
      throw new Error(defaultArgErrMsg);
    }
  });

  outro(action);

  /** methods */
  function displayHelp() {
    console.log(`
    Usage: tax [options] [command]
    Options:
      -h, --help  Display help for command

    Commands:
      config|c    Overwrite config-sync plugin files for taxonomies
      import|i    Import taxonomies data from ${exportPaths.path}, using import-export-entries plugin API
      export|e    Export taxonomies data in ${exportPaths.path}, using import-export-entries plugin API
    `);
  }

  function intro(action: string) {
    if (action === "config") {
      console.log('Overwriting config-sync "Taxonomies" files:');
      console.log(
        `targeting any file in "${configPaths.path}" of type "${configPaths.baseName}##api##${apiBaseId}{taxonomy_id}.${apiBaseId}{taxonomy_id}.json"\n`
      );
    } else if (action === "export") {
      console.log('Exporting "Taxonomies" content-types data:');
      console.log(`saving/overwriting files in "${exportPaths.path}"\n`);
    } else if (action === "import") {
      console.log('Importing "Taxonomies" content-type data:');
      console.log(`reading data from files in "${exportPaths.path}"\n`);
    }
  }

  function outro(action: string) {
    if (action === "config") {
      console.log(
        "\n➡️ config-sync files generation completed. Please run `yarn cs import` or `npm run cs import` to sync your database."
      );
    }
  }

  function writeConfigFile(apiId, filePath, configs) {
    if (apiId === "argomento") {
      console.log(`✅ ${apiId}`);
      return true;
    }

    if (
      !configs ??
      !configs.settings ??
      !configs.metadatas ??
      !configs.layouts
    ) {
      throw new Error(
        `property "configs" not found or found with unexpected values in config/taxonomies.ts.
			The configs object should contain "settings", "metadatas" and "layouts" props. See strapi-plugin-config-sync`
      );
    }

    if (!existsSync(filePath)) {
      console.warn(`⚠️ ${apiId}: file ${filePath} does not exist, skipping...`);
      return false;
    }

    const rawData = readFileSync(filePath);
    const taxonomy = JSON.parse(rawData.toString());

    if (taxonomy.value.uid != `api::${apiId}.${apiId}`)
      throw new Error(
        `❌ Failed reading "Taxonomy" config file, "uid" is not the one expected.\nfile: ${filePath}`
      );

    for (const prop in configs) {
      taxonomy.value[prop] = configs[prop];
    }

    writeFileSync(filePath, JSON.stringify(taxonomy, null, 2));

    console.log(`✅ ${apiId}`);
    return true;
  }

  async function exportFile(apiId, filePath) {
    const response = await postImportExportEntries("export", apiId, {
      exportFormat: "json",
      deepness: 2,
      relationsAsId: true,
    });

    if (!response?.data) {
      throw new Error(`Failed data export on ${apiId}`);
    }

    const { data: rawData } = response;
    const data = JSON.parse(rawData);

    if (!data || !Array.isArray(data) || !data.length) {
      console.error(
        `❌ ${apiId} collection type seems to be empty, skipping...`
      );
      return false;
    }
    // remove not necessary data

    for (const entry of data) {
      if (apiId !== "argomento") {
        delete entry.slug;
        delete entry.nome;
      }
      delete entry.id;
      delete entry.slugNome;
      delete entry.livello;
      delete entry.createdAt;
      delete entry.updatedAt;
      delete entry.createdBy;
      delete entry.updatedBy;
    }

    writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`✅ ${apiId}`);
    return true;
  }

  async function importFile(apiId, filePath) {
    if (!existsSync(filePath)) {
      console.warn(`⚠️ ${apiId}: file ${filePath} does not exist, skipping...`);
      return false;
    }

    const rawData = readFileSync(filePath);
    const data = JSON.parse(rawData.toString());

    const response = await postImportExportEntries("import", apiId, {
      data: JSON.stringify(data),
      format: "json",
    });

    if (
      response?.failures &&
      Array.isArray(response.failures) &&
      response.failures.length
    ) {
      const { error, data } = response.failures[0];

      console.error(
        `❌ ${apiId}: import failed.
      First failure:
      error: ${error}
      data: ${JSON.stringify(data, null, 2)}`
      );
      return false;
    }

    console.log(`✅ ${apiId}`);
    return true;
  }

  async function postImportExportEntries(
    action,
    apiId,
    body,
    apiBaseRoute = importExportEntriesApiBaseRoute
  ) {
    let apiRoute = apiBaseRoute;
    if (action === "export") {
      apiRoute += "export/contentTypes";
    } else if (action === "import") {
      apiRoute += "import";
    } else {
      throw new Error(defaultArgErrMsg);
    }

    if (!body?.slug) {
      body.slug = `api::${apiId}.${apiId}`;
    }

    const response = await fetch(`http://${host}:${port}${apiRoute}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "application/json",
      },
    });

    return await response.json();
  }
} catch (e) {
  console.error(e);
}
