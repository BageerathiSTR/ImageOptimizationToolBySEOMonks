  var bDebug = false;

    var fieldMap = {
        120 : 'caption',
        110 : 'credit',
        25 : 'keywords',
        85 : 'byline',
        122 : 'captionWriter',
        105 : 'headline',
        116 : 'copyright',
        15 : 'category'
    };

    function readIPTCData(oFile, iStart, iLength) {
        var data = {};

        if (oFile.getStringAt(iStart, 9) != "Photoshop") {
            if (bDebug) log("Not valid Photoshop data! " + oFile.getStringAt(iStart, 9));
            return false;
        }

        var fileLength = oFile.getLength();

        var length, offset, fieldStart, title, value;
        var FILE_SEPARATOR_CHAR = 28,
            START_OF_TEXT_CHAR = 2;

        for (var i = 0; i < iLength; i++) {

            fieldStart = iStart + i;
            if(oFile.getByteAt(fieldStart) == START_OF_TEXT_CHAR && oFile.getByteAt(fieldStart + 1) in fieldMap) {
                length = 0;
                offset = 2;

                while(
                    fieldStart + offset < fileLength &&
                    oFile.getByteAt(fieldStart + offset) != FILE_SEPARATOR_CHAR &&
                    oFile.getByteAt(fieldStart + offset + 1) != START_OF_TEXT_CHAR) { offset++; length++; }

                if(!length) { continue; }

                title = fieldMap[oFile.getByteAt(fieldStart + 1)];
                value = oFile.getStringAt(iStart + i + 2, length) || '';
                value = value.replace('\000','').trim();

                data[title] = value;
                i+=length-1;
            }
        }

        return data;

    }

    function findIPTCinJPEG(oFile) {
        var aMarkers = [];

        if (oFile.getByteAt(0) != 0xFF || oFile.getByteAt(1) != 0xD8) {
            return false; // not a valid jpeg
        }

        var iOffset = 2;
        var iLength = oFile.getLength();
        while (iOffset < iLength) {
            if (oFile.getByteAt(iOffset) != 0xFF) {
                if (bDebug) console.log("Not a valid marker at offset " + iOffset + ", found: " + oFile.getByteAt(iOffset));
                return false; // not a valid marker, something is wrong
            }

            var iMarker = oFile.getByteAt(iOffset+1);

            if (iMarker == 237) {
                if (bDebug) console.log("Found 0xFFED marker");
                return readIPTCData(oFile, iOffset + 4, oFile.getShortAt(iOffset+2, true)-2);

            } else {
                iOffset += 2 + oFile.getShortAt(iOffset+2, true);
            }

        }

    }

    IPTC.readFromBinaryFile = function(oFile) {
        return findIPTCinJPEG(oFile);
    }