
package main

import (
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"strings"
	"io/ioutil"
	"os"
	"path"
)

//For Example:
//go run cvs_copy.go file1.csv D:/upfiles/shejidanwei d:/upfiles/users
//

// CopyFile copies a file from src to dst. If src and dst files exist, and are
// the same, then return success. Otherise, attempt to create a hard link
// between the two files. If that fail, copy the file contents from src to dst.
func CopyFile(src, dst string) (err error) {
    sfi, err := os.Stat(src)
    if err != nil {
		log.Printf("1: %s",err)
        return
    }
    if !sfi.Mode().IsRegular() {
        // cannot copy non-regular files (e.g., directories,
        // symlinks, devices, etc.)
        return fmt.Errorf("CopyFile: non-regular source file %s (%q)", sfi.Name(), sfi.Mode().String())
    }
    dfi, err := os.Stat(dst)
    if err != nil {
        if !os.IsNotExist(err) {
			log.Printf("2: %s",err)
            return
        }
    } else {
        if !(dfi.Mode().IsRegular()) {
            return fmt.Errorf("CopyFile: non-regular destination file %s (%q)", dfi.Name(), dfi.Mode().String())
        }
        if os.SameFile(sfi, dfi) {
            return
        }
    }
    if err = os.Link(src, dst); err == nil {
        return
    }
    err = copyFileContents(src, dst)
    return
}

// copyFileContents copies the contents of the file named src to the file named
// by dst. The file will be created if it does not already exist. If the
// destination file exists, all it's contents will be replaced by the contents
// of the source file.
func copyFileContents(src, dst string) (err error) {
    in, err := os.Open(src)
    if err != nil {
		log.Printf("3: %s",err)
        return
    }
    defer in.Close()
    out, err := os.Create(dst)
    if err != nil {
		log.Printf("4: %s",err)
        return
    }
    defer func() {
        cerr := out.Close()
        if err == nil {
            err = cerr
        }
    }()
    if _, err = io.Copy(out, in); err != nil {
        return
	}
	
    err = out.Sync()
    return
}


func main(){
	//fmt.Printf(os.Args[1])

	data,err := ioutil.ReadFile(os.Args[1])
	if err != nil {
		log.Fatal(err)
	}
	//源文件的根路径
	srcDir := os.Args[2];
	destDir := os.Args[3];

	r := csv.NewReader(strings.NewReader(string(data)))
	//跳过第一行
	record, err := r.Read()
	if err == io.EOF {
		return
	}

	for {

		record, err = r.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}
		//fmt.Printf("%2s %32s %7s %32s %32s\n",record[0],record[1],record[2],record[3],record[4])
		
		sysUserId := record[1]
		unitId := record[2]

		for i:=3 ; i< len(record); i++{
			file := record[i]
			
			if file == "NULL" {
				continue
			}

			srcFile := path.Join(srcDir,unitId,file)
			destFile := path.Join(destDir,sysUserId,file)
			//创建目录
			sp := strings.LastIndex(destFile,"/")
			os.MkdirAll(destFile[0:sp],os.ModeDir)

			
			err := CopyFile(srcFile,destFile)
			if err == nil {
				log.Printf("copy %s ==> %s\n",srcFile,destFile)
			}
		}
		
	}

}

//cvs_copy user.csv D:/upfiles/shejidanwei d:/upfiles/users