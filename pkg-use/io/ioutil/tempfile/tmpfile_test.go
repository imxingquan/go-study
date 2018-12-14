package main
// go run test tmpfile_test -v
//
import(
	"io/ioutil"
	"testing"
)

func TestTempFile2(t *testing.T){
	ioutil.TempFile("","temp123")
	t.Logf("out message")
}