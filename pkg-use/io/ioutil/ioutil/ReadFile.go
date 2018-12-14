// ioutil.ReadFile example
// ReadFile(filename string)([]byte,error)

package main

import (
	"fmt"
	"io/ioutil"
	"log"
)

func main(){

	data,err := ioutil.ReadFile("ReadFile.go")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("data=%s\n",data)
	fmt.Printf("length=%d\n",len(data))

	_,err = ioutil.ReadFile("no exist file")
	log.Fatal(err)
}