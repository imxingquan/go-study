package main

import "fmt"

type person struct{
    Name string
    Age int
}

type doubleZero struct{
    person
    LincenseToKill bool
}

func (p person) Greeting(){
    fmt.Println("I'm just a regular person.")
}

func (dz doubleZero)Greeting(){
    fmt.Println("Miss Moneypenny,so good to see")
}

func main(){
    p1 := person{
        Name: "Ian Flemming",
        Age : 44,
    }

    p2 := doubleZero{
        person: person{
            Name: "James Bound",
            Age: 23,
        },
        LincenseToKill: true,
    }
    p1.Greeting()
    p2.Greeting()
    p2.person.Greeting()
}