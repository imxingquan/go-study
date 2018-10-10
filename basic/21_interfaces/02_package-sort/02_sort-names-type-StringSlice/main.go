package main

import(
    "fmt"
    "sort"
)

func main(){
    s := []string{"Zeno","John","Al","Jennhy"}

    fmt.Println(s)
    
    sort.Sort(sort.StringSlice(s))
    
    fmt.Println(s)
}