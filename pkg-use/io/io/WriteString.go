// io.WriteString(w Writer, s string) (n int, err error)
// 写字符串s 到 w

package main

import (
	"fmt"
	"io"
	"os"
	"io/ioutil"
	//"strings"
)

func ExampleWriteStringToStdout(){
	fmt.Println("=========ExampleWriteStringToStdout=====")
	io.WriteString(os.Stdout,"Hello World")
}

func ExampleWriteStringToFile(){
	fmt.Println("=========ExampleWriteStringToFile=====")

	f,_ := ioutil.TempFile("d:/tmp","writestring*.txt")
	io.WriteString(f,"This man is short and heavy")

	f.Close()
}

func main(){
	
	ExampleWriteStringToStdout()
	ExampleWriteStringToFile()

}