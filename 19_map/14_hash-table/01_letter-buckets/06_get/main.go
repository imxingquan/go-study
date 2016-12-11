package main

import (
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
)

func main(){
    res, err := http.Get("http://wwww.baidu.com")
    if err != nil {
        log.Fatal(err)
    }

    bs,err := ioutil.ReadAll(res.body)
    if  err != nil{
        log.Fatal(err)
    }
    fmt.Println("%s",bs)

}