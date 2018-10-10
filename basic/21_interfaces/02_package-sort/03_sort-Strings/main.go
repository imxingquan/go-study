package main

import (
    "fmt"
    "sort"
)

func main(){
    s := []string{"Zone","John","Al","Jenny"}

    sort.Strings(s)

    fmt.Println(s)
}