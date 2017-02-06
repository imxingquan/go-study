package main

import(
    "fmt"
    "sort"
)

func main(){
    s := []string{"Zone","John","Al","Jenny"}

    fmt.Println(s)
    sort.Sort(sort.Reverse(sort.StringSlice(s)))
    fmt.Println(s)

    sort.Sort(sort.StringSlice(s))
    fmt.Println(s)

    fmt.Printf("Just s: %T\n",s)
    s = sort.StringSlice(s)
    fmt.Printf("Just s: %T\n",s)
    var t = sort.StringSlice(s)
    fmt.Printf("just t: %T\n",t)

    fmt.Printf("s converted to StringSlice: %T\n",sort.StringSlice(s))
    //fmt.Printf("s sorted: %T\n",sort.Sort(sort.StringSlice(s)))
    fmt.Printf("s reversed: %T\n", sort.Reverse(sort.StringSlice(s)))

    i := sort.Reverse(sort.StringSlice(s))
    fmt.Println(i)
    fmt.Printf("%T\n",i)
    sort.Sort(i)
    fmt.Println(s)
}