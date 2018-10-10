/* 使用&来取变量的内存地址
*/

package main

import "fmt"

func main(){

    a := 43

    fmt.Println("a -",a)
    fmt.Println("a's memory address -",&a)
    fmt.Printf("%d \n",&a)
}

/* output:
a - 43
a's memory address - 0xc0420381c0
825741246912
*/