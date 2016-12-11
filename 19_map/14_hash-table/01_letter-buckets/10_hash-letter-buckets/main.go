package main

import(
    "bufio"
    "fmt"
    "log"
    "net/http"
)

func main(){

    res,err := http.Get("http://wwww.baidu.com")
    if err != nil{
        log.Fatal(err)
    }

    scanner := bufio.NewScanner(res.Body)
    defer res.Body.Close()

    scanner.Split(bufio.ScanWords)

    buckets := make([]int,200)

    for scanner.Scan(){
        n := hashBucket(scanner.Text())
    }
    fmt.Println(buckets[65:123])


}

func hashBucket(word string) int{
    return int(word[0])
}