package caselabels

import "errors"

var CurrentLabel = "000"

var currentLabel = []rune{'0', '0', '0'}

func NextLabel() string {
	oldLabel := CurrentLabel

	if currentLabel[2] == 'Z' {
		currentLabel[2] = '0'
		if currentLabel[1] == 'Z' {
			currentLabel[1] = '0'
			if currentLabel[0] == 'Z' {
				panic(errors.New("Ran out of labels!"))
			} else {
				currentLabel[0] = nextLabelChar(currentLabel[0])
			}
		} else {
			currentLabel[1] = nextLabelChar(currentLabel[1])
		}
	} else {
		currentLabel[2] = nextLabelChar(currentLabel[2])
	}

	CurrentLabel = string(currentLabel)
	return oldLabel
}

func nextLabelChar(c rune) rune {
	if c == '9' {
		return 'A'
	} else {
		return c + 1
	}
}
