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
    "path/filepath"

)
import "strconv"
import "strings"

var G_IDX int

func renameIterator(path string, file os.FileInfo,err error)(e error){
   
    //fmt.Printf("%s\n",file.Name())
    
    
    if *pNewFileName == ""{
        return
    }

    if file.IsDir(){
        return
    }
        
    G_IDX = G_IDX + 1
    
    sIdx := strconv.Itoa(G_IDX);

    //在新文件名称结尾添加递增数字
    fileName := *pNewFileName + sIdx

    //如果新文件名称中包含 % 将百分号替换成递增数字
    if strings.Contains(*pNewFileName,"@") == true {
        fileName =  strings.Replace(*pNewFileName,"@",strconv.Itoa(G_IDX),-1)
    }
    
    fmt.Printf("filename:%s,idx:%d\n",fileName,G_IDX)

    fileName = fileName + filepath.Ext(path)

    currDir := filepath.Dir(path)

    p := filepath.Join(currDir,fileName)
    os.Rename(path, p)
    fmt.Printf("%s --> %s\n",path,p)
    
    return
}

 var pHelp = flag.Bool("help,h",false,"Show help info.")
 var   pDir =  flag.String("d","","指定文件所在目录")
 var   pNewFileName = flag.String("n","","新的文件名。文件名中的%将被替换成递增数字")

func main(){
   
   

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
   
    filepath.Walk(*pDir,renameIterator)
    

    
}