//switch 多项比配
package main

import "fmt"

func main(){
    switch "Jenny"{
        case "Tim","Jenny":
            fmt.Println("Wassup Tim, or err,Jenny")
        case "Marcus","Mehdi":
            fmt.Println("Both of your names start with M")
        case "dds","Sushant":
            fmt.Println("Wassup dss /Sushant")
    }
}