package main

import (
  "database/sql"
  "fmt"
  "log"

  _ "github.com/denisenkom/go-mssqldb"
)

func main() {
  condb, errdb := sql.Open("mssql", "server=47.105.37.14;user id=csdbuser;password=27278617@qq.com")
  if errdb != nil {
    fmt.Println(" Error open db:", errdb.Error())
  }

  var (
    sqlversion string
  )

  rows, err := condb.Query("select @@version")
  if err != nil {
    log.Fatal(err)
  }
  for rows.Next() {
    err := rows.Scan(&sqlversion)
    if err != nil {
      log.Fatal(err)
    }
    log.Println(sqlversion)
  }
  defer condb.Close()
}