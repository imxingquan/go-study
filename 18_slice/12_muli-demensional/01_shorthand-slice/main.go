package main

import "fmt"

func main(){
    student := []string{} //推断类型并初始化
    students := [][]string{}

    fmt.Println(student)
    fmt.Println(students)
    fmt.Println(student == nil) //false
}