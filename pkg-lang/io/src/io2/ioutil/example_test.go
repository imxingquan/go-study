package ioutil_test

import (
	"fmt"
	"io/ioutil"
	"log"
	//"os"
	//"path/filepath"
	"strings"
)

//测试ioutil.ReadAll
func ExampleReadAll(){
	r := strings.NewReader("字符串一大波来了来了")

	b,err := ioutil.ReadAll(r)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s",b)
}

func main(){
	ExampleReadAll()
}
/**
测试包名称是原包名+"_test" ioutil_test
go test io/ioutil
*/