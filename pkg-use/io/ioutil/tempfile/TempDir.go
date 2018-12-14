package main

import (
	"io/ioutil"
	"fmt"
	"os"
)
// 创建临时目录
// ioutil.TempDir(dir,prefix string)(name string,err error)

func main(){

	tmpDir,err := ioutil.TempDir("","")
	if err != nil {
		fmt.Print(err)
	}
	//defer os.RemoveAll(tmpDir)

	fmt.Printf("随机数字临时目录名称:[%s]\n",tmpDir)

	tmpDir,err = ioutil.TempDir("d:/tmp","ABC")
	if err != nil {
		fmt.Print(err)
	}
	//defer os.RemoveAll(tmpDir)
	fmt.Printf("加前缀的临时目录名称:[%s]\n",tmpDir)

}