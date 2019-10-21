const _ = require("lodash");

const config = require("./globalMulterVariables.json");
const defaultConfig = config.multer;
// const environment = process.env.NODE_ENV || "development";
// const environmentConfig = config[environment];
// const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global.gConfigMulter = defaultConfig;

// // log global.gConfig
// console.log(
//     `global.gConfig: ${JSON.stringify(
// 		global.gConfig,
// 		undefined,
// 		global.gConfig.json_indentation
// 	)}`
// );

console.log("global.gConfig:", global.gConfigMulter)