package main

import "fmt"

type person struct{
    First string
    Last string
    Age int
}

type doubleZero struct{
    person
    First string
    LicenseToKill bool
}

func main(){
    p1 := doubleZero{
        person: person{
            First: "James",
            Last: "Bond",
            Age: 20,
        },
        First : "Double Zero First",
        LicenseToKill: true,
    }
   

    p2 := doubleZero{
        person: person{
            First: "Miss",
            Last: "MoneyPenny",
            Age: 19,
        },
        First: "If looks could kill",
        LicenseToKill: false,
    }

    fmt.Println(p1.First,p1.person.First,p1.Last)
    fmt.Println(p2.First)
}
