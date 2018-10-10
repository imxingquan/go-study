/*
  文件批量改名
  author:xingquan
  2017/5/5
*/
package main

import (
    "flag"
    "fmt"
    "os"
    "io/ioutil"
)
import "strconv"
import "strings"
import "path/filepath"

var G_IDX int


func main(){
   
    pHelp := flag.Bool("help,h",false,"Show help info.")
    pDir :=  flag.String("d","","Directory Path")
    pNewFileName := flag.String("n","","New File Name")

    //没有参数 打印提示 退出程序   
    if len(os.Args) <= 1 {
        flag.Usage()
        return
    }

    flag.Parse()
   
    if *pHelp {
        flag.Usage()
        fmt.Println("dir=",*pDir,*pNewFileName,len(os.Args))
        return;
    }
    
    fmt.Println("dir=",*pDir,*pNewFileName,len(os.Args))
    /*
      Get All Files In args special directory path.
    */
    list, err := ioutil.ReadDir(*pDir)
    if err != nil {
        fmt.Println(err)
        return;
    }

    if *pNewFileName == ""{
        return 
    }

    for _, dir := range list{
        if !dir.IsDir() {

             G_IDX = G_IDX + 1
    
            sIdx := strconv.Itoa(G_IDX);

            //在新文件名称结尾添加递增数字
            fileName := *pNewFileName + sIdx

            //如果新文件名称中包含 % 将百分号替换成递增数字
            if strings.LastIndex(*pNewFileName,"%") != -1{
                fileName =  strings.Replace(*pNewFileName,"%",sIdx,-1)
            }


            oldPath := filepath.Join(*pDir,dir.Name())
            newPath := filepath.Join(*pDir,fileName)
            os.Rename(oldPath,newPath)
            fmt.Printf("%s --> %s\n",oldPath,newPath)
        }
    }

    
}