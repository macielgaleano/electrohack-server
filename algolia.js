const algoliasearch = require("algoliasearch");
const client = algoliasearch("PW7Q8HCMTL", "4eadc8f72bc64cbf48d67887005cb3c1");
const index = client.initIndex("test_MOVIES");
