package stringutil_test

import "testing"
import . "stringutil"

func TestReverse(t *testing.T){
    cases :=[] struct{
        in,want string
    }{
        {"Hello,World","dlroW,olleH"},
        {"世界","界世"},
    }

    for _, c := range cases{
        got := Reverse(c.in)
        if got != c.want{
            t.Errorf("Reverse(%q) == %q, want %q",c.in,got,c.want)
        }
    }
}