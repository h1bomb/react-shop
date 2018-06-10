const koa = require("koa"); // koa@2
const koaRouter = require("koa-router");
const koaBody = require("koa-bodyparser");
const { graphqlKoa, graphiqlKoa } = require("apollo-server-koa");
const connectMongo = require("./schema/mongo-connector");
const schema = require("./schema/passport");
const { authenticate } = require("./authentication");
const app = new koa();
const router = new koaRouter();
const PORT = 3001;
const start = async () => {
  const mongo = await connectMongo();

  const buildOptions = async (req, res) => {
    const user = await authenticate(req, mongo.Users);
    return {
      context: {
        mongo,
        user,
        req
      },
      schema
    };
  };

  // koaBody is needed just for POST.
  app.use(koaBody());
  app.use(async (ctx, next) => {
    await next();
    ctx.set("access-control-allow-credentials", "true");
    ctx.set("access-control-allow-headers", "content-type");
    ctx.set("access-control-allow-origin", "*");
  });

  router.post("/graphql", graphqlKoa(buildOptions));
  router.get("/graphql", graphqlKoa(buildOptions));
  // Setup the /graphiql route to show the GraphiQL UI
  router.get(
    "/graphiql",
    graphiqlKoa({
      endpointURL: "/graphql", // a POST endpoint that GraphiQL will make the actual requests to
      passHeader: `'Authorization': 'bearer token-hbomb@126.com'`
    })
  );

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(PORT);
};

start();
