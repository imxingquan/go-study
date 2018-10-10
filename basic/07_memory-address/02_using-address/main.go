package main

import "fmt"

const metersToYards float64 = 1.09361

func main(){
    var meters float64
    fmt.Print("Enter meters swam:")
    fmt.Scan(&meters) //往变量的地址里写接收到的值

    yards := meters * metersToYards
    fmt.Println(meters," meters is ",yards, " yards")
}