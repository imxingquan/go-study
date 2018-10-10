package main

import (
	"fmt"
	"reflect"
)

func main() {
	var x float64 = 3.14
	v := reflect.ValueOf(&x)
    
    //v.SetFloat(3.2) error
	
    fmt.Println("type of v:", v.Type())
	fmt.Println("setablility of v:", v.CanSet())

	p := v.Elem()
	fmt.Println("setablility of p:", p.CanSet())

    p.SetFloat(7.1)
    fmt.Println(v.Interface())
    fmt.Println(x)

   
}

/*
type of v: *float64
setablility of v: false
setablility of p: true
0xc42000e298
7.1
*/