package main

import (
    "bufio"
    "fmt"
    "log"
    "net/http"
)

func main(){

    res,err := http.Get("http://www.baidu.com")

    if err != nil{
        log.Fatal(err)
    }

    //sean the page
    //NewScanner takes a eader and res.Body 
    scanner := bufio.NewScanner(res.Body)
    defer res.Body.Close()

    scanner.Split(bufio.ScanWords)

    for scanner.Scan(){
        fmt.Println(scanner.Text())
    }
}