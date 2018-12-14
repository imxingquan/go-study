// ioutil.ReadDir(dirname string)([]os.FileInfo,error)
// 取目录或文件

package main

import (
	"fmt"
	"io/ioutil"
	"log"
)

func ExampleReadDir(){

	files, err := ioutil.ReadDir(".")
	if err != nil {
		log.Fatal(err)
	}

	for i,file := range files {
		switch {
		case !file.IsDir():
			fmt.Printf("%d:%s is file!\n",i,file.Name())
		case file.IsDir():
			fmt.Printf("%d:%s is Directory\n",i,file.Name())
		}
	}


}

func main(){
	ExampleReadDir()
}

