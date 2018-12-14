
/**

go test io2/ioutil
*/

package ioutil

import (
	"io/ioutil"
	"os"
	"testing"
)

func checkSize(t * testing.T, path string, size int64){
	dir, err := os.Stat(path)
	t.Logf("size = [%d]",dir.Size());
	if err != nil {
		t.Fatalf("Stat %q (looking for size %d):%s",path,size,err)
	}

	if dir.Size() != size {
		t.Errorf("Stat %q: size %d want %d",path,dir.Size(),size)
	}
}

func TestReadFile(t *testing.T){
	filename := "rumpelstilzchen"
	contents, err := ioutil.ReadFile(filename)
	if err == nil {
		t.Fatalf("ReadFile %s: error expected, none found",filename)
	}

	filename = "ioutil_test.go"
	contents,err = ioutil.ReadFile(filename)
	if err != nil {
		t.Fatalf("ReadFile %s: %v",filename,err)
	}

	checkSize(t,filename,int64(len(contents)))
}

func TestWriteFile(t *testing.T){
	f,err := ioutil.TempFile("","ioutil-test")
	if err != nil {
		t.Fatal(err)
	}

	filename := f.Name()
	t.Logf("filename=[%s]",filename)

}