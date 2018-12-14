
package io_test

import (
	"fmt"
	//"os"
	"testing"
	 "io"
	"bytes"
	"errors"
)


type Buffer struct{
	bytes.Buffer
	io.ReaderFrom
	io.WriterTo
}

// io.Copy
func TestCopy(t *testing.T){
	rb := new(Buffer)
	wb := new(Buffer)
	rb.WriteString("hello, world.")
	io.Copy(wb,rb)
	if wb.String() != "hello, world."{
		t.Errorf("Copy dit not work properly")
	}

	
}

func TestCopyNegative(t *testing.T) {
	rb := new (Buffer)
	wb := new (Buffer)

	rb.WriteString("hello")

	// 复制数据到 -1大小的缓冲区内
	io.Copy(wb,&io.LimitedReader{R:rb,N:-1})
	if wb.String() != "" {
		t.Errorf("Copy on LimitedReader N<0 copied data")
	}
	// 复制数据到 -1大小的缓冲区内
	io.CopyN(wb,rb,-1)
	if wb.String() != "" {
		t.Errorf("CopyN with N<0 copied data")
	}

	// 从rb 读1个byte到wb, 
	// wb = "h" rb = "ello"
	lr := io.LimitedReader{R:rb,N:1}
	io.Copy(wb,&lr)
	if wb.String()=="h" && rb.String()=="ello" {
		t.Logf("wb=%s,rb=%s",wb,rb)
	}
}

func TestCopyBuffer(t *testing.T){
	rb := new (Buffer)
	wb := new (Buffer)

	rb.WriteString("hello, world")
	io.CopyBuffer(wb,rb,make([]byte,1))
	if wb.String() != "hello, world" {
		t.Errorf("CopyBuffer did not work properly")
	}

	if rb.String() != "" {
		t.Errorf("wb=%s,rb=%s",wb,rb)
	}

}

func TestCopyReadFrom(t *testing.T){
	rb := new (Buffer)
	wb := new (bytes.Buffer) //使用Buffer 中的ReadForm实现
	rb.WriteString("hello, world.")
	io.Copy(wb, rb)
	if wb.String() != "hello, world." {
		t.Errorf("Copy did not work properly")
	}
}

func TestCopyWriteTo(t *testing.T){
	rb := new (bytes.Buffer) //使用Buffer中的WriteTo
	wb := new (Buffer)
	rb.WriteString("hello, world.")
	io.Copy(wb,rb)
	if wb.String() != "hello, world." {
		t.Errorf("Copy did not work properly")
	}
}

type writeToChecker struct {
	bytes.Buffer
	writeToCalled bool
}

func (wt *writeToChecker) WriteTo(w io.Writer)(int64,error){
	wt.writeToCalled = true
	return wt.Buffer.WriteTo(w)
}

// 优先使用WriteTo方法
func TestCopyPriority(t *testing.T){
	rb := new(writeToChecker)
	wb := new(bytes.Buffer)
	rb.WriteString("hello, world.")
	io.Copy(wb,rb)
	if wb.String() != "hello, world." {
		t.Errorf("Copy did not work properly")
	}else if !rb.writeToCalled {
		t.Errorf("WriteTo was not prioritied over ReadFrom")
	}
}

type zeroErrReader struct {
	err error
}

func (r zeroErrReader) Read(p []byte) (int, error) {
	return copy(p, []byte{0}), r.err
}

type errWriter struct {
	err error
}

func (w errWriter) Write([]byte) (int, error) {
	return 0, w.err
}

// In case a Read results in an error with non-zero bytes read, and
// the subsequent Write also results in an error, the error from Write
// is returned, as it is the one that prevented progressing further.
func TestCopyReadErrWriteErr(t *testing.T) {
	er, ew := errors.New("readError"), errors.New("writeError")
	r, w := zeroErrReader{err: er}, errWriter{err: ew}
	n, err := io.Copy(w, r)
	if n != 0 || err != ew {
		t.Errorf("Copy(zeroErrReader, errWriter) = %d, %v; want 0, writeError", n, err)
	}
}

//测试内置的copy
func TestCcopy(t *testing.T){
	dst := make([]byte,8,11) //make(type,len,cap)
	
	src := []byte("hello")
	copy(dst,src)
	if string(dst)[0:2] != "he" {
		fmt.Println("dst=",string(dst)[0:2])
		t.Errorf("copy src=%s,dst=%s,len(dst)=%d,cap(dst)=%d",src,dst,len(dst),cap(dst))
	}
}