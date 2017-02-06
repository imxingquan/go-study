package main

import (
    "fmt"
    "sort"
)

type person struct{
    Name string
    Age int
}

func (p person) String() string{
    return fmt.Sprintf("YAYAYA %s: %d",p.Name,p.Age)
}

//ByAge  声明排序接口

type ByAge []person

func (a ByAge)Len() int {return len(a)}
func (a ByAge)Swap(i,j int){a[i],a[j] = a[j],a[i]}
func (a ByAge)Less(i,j int)bool{return a[i].Age < a[j].Age}


func main(){
    people := []person{
        {"Bob",31},
        {"John",42},
        {"Micheael",17},
        {"Jenny",26},
        {"Ada",18},
    }

    fmt.Println(people[0])
    fmt.Println(people)
    sort.Sort(ByAge(people))
    fmt.Println(people)
}