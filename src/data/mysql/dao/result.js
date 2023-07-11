const Result = require("../models/result");
const AppCategories = require("../models/app-category");
const sequelize = require("../index");

exports.insert = (dto) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await Result.bulkCreate(parseResultsEntriesToInsert(dto));
      const appsCategories = await AppCategories.bulkCreate(
        parseAppCategoriesEntriesToInsert(
          dto.packageName,
          dto.version,
          dto.categories
        )
      );
      resolve({ ...results, ...appsCategories });
    } catch (error) {
      reject(error);
    }
  });
};

const parseAppCategoriesEntriesToInsert = (package, version, categories) => {
  return categories.map((category) => ({
    category,
    package,
    version,
  }));
};

const assignStars = (
  result,
  threshold4,
  threshold3,
  threshold2,
  threshold1,
  threshold0
) => {
  let stars = 0;

  switch (true) {
    case result < threshold4:
      stars = 5;
      break;
    case threshold4 <= result < threshold3:
      stars = 4;
      break;
    case threshold3 <= result < threshold2:
      stars = 3;
      break;
    case threshold2 <= result < threshold1:
      stars = 2;
      break;
    case threshold1 <= result < threshold0:
      stars = 1;
      break;
    default:
  }

  return stars;
};

const calcStars = (test, result) => {
  let stars = 0;

  // determines the test and attributes a star rating based on the defined warning thresholds
  switch (test) {
    case "BindingResources2Early":
      break;
    case "Blob":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "Excessive Calls (random result)":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "Excessive Method Calls Detector":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "HashMap Excessive (random result)":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "HashMap Usage Detector":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "HashMapUsageAndroid":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "Internal Getter Detector":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "InternalGetterAndSettersAndroid":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "LargeClassLowCohesion":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "LazyClass":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "LongParameterList":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "Member Ignoring Method Detector":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "RefusedParentBequest":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "ReleasingResources2Late":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "SpaghettiCode":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "SpeculativeGenerality":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    case "Static analysis (Abstract Interpretation)":
      stars = assignStars(result, 20, 40, 60, 80);
      break;
    default:
      break;
  }

  return stars;
};

const parseResultsEntriesToInsert = (dto) => {
  return dto.results.map((result) => ({
    appName: dto.appName,
    package: dto.packageName,
    version: dto.version,
    testName: result.name,
    testParameter: result.parameters,
    testResult: result.result,
    unit: result.unit,
    timestamp: dto.timestamp,
    optional: result.optional,
    stars: calcStars(result.name, result.result),
  }));
};

exports.update = (dto) => {
  return new Promise((resolve, reject) => {
    const updt = parseResultsEntriesToInsert(dto);
    updt.forEach((test) => {
      Result.update(
        { ...test, state: 1 },
        {
          where: {
            package: dto.packageName,
            version: dto.version,
            testName: test.testName,
            testParameter: test.testParameter,
          },
        }
      )
        .then((result) => resolve(result.dataValues))
        .catch((error) => reject(error));
    });
  });
};

exports.getByApp = (dto) => {
  return new Promise((resolve, reject) => {
    sequelize
      .query(
        `select app_name, r.package, r.version, test_name, test_parameter, test_result, unit, optional, ` +
          `category, timestamp from results r join apps_categories ac on r.package = ac.package and r.version = ac.version ` +
          `where r.package = :package and r.version = :version`,
        {
          model: Result,
          mapToModel: true,
          replacements: { package: dto.packageName, version: dto.version },
          type: sequelize.QueryTypes.SELECT,
        }
      )
      .then((result) => resolve(parseEntriesToResponse(result)))
      .catch((error) => reject(error));
  });
};

const parseEntriesToResponse = (entries) => {
  if (entries.length == 0) return {};
  const categories = [];
  entries.forEach((result) => {
    if (!categories.includes(result.dataValues.category))
      categories.push(result.dataValues.category);
  });
  const results = entries.map((result) => ({
    name: result.dataValues.testName,
    parameters: result.dataValues.testParameter,
    result: result.dataValues.testResult,
    unit: result.dataValues.unit,
    state: result.dataValues.state,
  }));
  return {
    appName: entries[0].dataValues.appName,
    packageName: entries[0].dataValues.package,
    version: entries[0].dataValues.version,
    timestamp: entries[0].dataValues.timestamp,
    categories: categories,
    results: results,
  };
};
