import app from "./app.js"

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running at port 4000")
})
