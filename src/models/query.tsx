import CONFIG from "../lib/config"

const GQL_URL = CONFIG.API_URL + "/graphql"

export const rows = async (
  tablename: string,
  typename: string,
  fields: string
): Promise<any[] | Error> => {
  const gqlQuery = `query { rows(tablename: "${tablename}", typename: "${typename}") { ... on ${typename} { ${fields} } } }`
  return query(gqlQuery, "rows")
}

export const query = (gqlQuery: string, name: string): any | Error =>
  fetch(GQL_URL, {
    body: JSON.stringify({ query: gqlQuery }),
    headers: { "Content-Type": "application/json" },
    method: "POST"
  })
    .then(res => res.json())
    .then(json => {
      if (json.errors && json.errors.length) {
        console.error("ERR: " + json.errors[0].message)
        return Error(json.errors[0].message)
      }
      if (!json.data[name]) {
        console.error("Null result from: " + gqlQuery)
        return Error("Null result.")
      }
      return json.data[name]
    })
