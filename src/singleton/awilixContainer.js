// **************************** AWILIX CONTAINER LOGIC ************************
const awilix = require("awilix");
const Lifetime = awilix.Lifetime;

// for db dependency injection
// mongo db mongoose connection will be set in every method of the initiating thread
// eg for main services that are used in api, we will set the mongooseConnection in the api middleware
// for any other place in the main thread we need to call a service from the container,
// we need to set the mongooseConnection in the scope first
// for background thread same logic applies
const { BASE_DB_URI } = require("../config/env.json");

// Auto-load our services and our repositories
const opts = {
  // We want ClassicalService to be registered as classicalService.
  formatName: "camelCase",
  cwd: __dirname,
  formatName: (name, descriptor) => {
    const splat = descriptor.path.split("/");
    const namespace = splat[splat.length - 3]; // `dbModel` or `service`
    const unit = splat[splat.length - 2]; // `user, tenant etc`
    const upperNamespace =
      namespace.charAt(0).toUpperCase() + namespace.substring(1);
    return unit + upperNamespace;
  }
};

const Container = (() => {
  let container;
  const setContainer = nodeProcessName => {
    try {
      /**
       * Create a container
       */
      container = awilix.createContainer();

      console.log(
        JSON.stringify({
          file: nodeProcessName,
          service: "awilixContainer",
          method: "setContainer",
          meta: { nodeProcessName, processPid: process.pid }
        })
      );

      container.register({
        BASE_DB_URI: awilix.asValue(BASE_DB_URI)
      });

      container.loadModules(
        [
          // Glob patterns
          // '../service/*/index.js',
          // '../dbModel/*/index.js',
          // ******************************
          // To have different resolverOptions for specific modules.
          [
            "../dbModel/*/index.js",
            {
              register: awilix.asClass,
              lifetime: Lifetime.SCOPED
            }
          ],
          [
            "../service/*/index.js",
            {
              register: awilix.asClass,
              lifetime: Lifetime.SCOPED
            }
          ]
        ],
        opts
      );

      console.log(`${nodeProcessName} AWILIX CONTAINER: `, container);
      console.log(
        `${nodeProcessName} AWILIX CONTAINER REGISTRATIONS: `,
        container.registrations
      );
      console.log(
        JSON.stringify({
          file: nodeProcessName,
          service: "awilixContainer",
          method: "setContainer",
          meta: { nodeProcessName, processPid: process.pid },
          message: "AWILIX CONTAINER INITIALIZED"
        })
      );

      return container;
    } catch (error) {
      console.log(
        JSON.stringify({
          file: nodeProcessName,
          service: "awilixContainer",
          method: "setContainer",
          meta: { error: error.message }
        })
      );
    }
  };
  return {
    getContainer: nodeProcessName => {
      console.log(
        JSON.stringify({
          file: nodeProcessName,
          service: "awilixContainer",
          method: "getContainer",
          meta: { nodeProcessName, processPid: process.pid }
        })
      );
      if (!container) {
        console.log(
          JSON.stringify({
            file: nodeProcessName,
            service: "awilixContainer",
            method: "getContainer",
            meta: {
              isContainerFound: false,
              nodeProcessName,
              processPid: process.pid
            }
          })
        );
        container = setContainer(nodeProcessName);
      }
      return container;
    }
  };
})();

module.exports = {
  container: nodeProcessName => Container.getContainer(nodeProcessName)
};
