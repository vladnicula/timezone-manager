import morgan from "morgan"

export default function(app) {
  app.use(morgan("combined"))
}
