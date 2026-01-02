from fastapi import FastAPI, UploadFile, File, Form, Request 
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import json
from fastapi.encoders import jsonable_encoder


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...),
    rows: int = Form(...),
    cols: int = Form(...),
    maxp: int = Form(...),
    layouts: str = Form(...)):
    print(">>> /upload called. Starting computation.")

    # print(layouts)
    try:
        layout = json.loads(layouts)
    except:
        return {"error": "Invalid table JSON"}

    row = rows
    coloumn = cols
    maxPeriod = maxp
    # layout = json.loads(layouts)


    contents = await file.read()  

    if file.filename.endswith(".csv"):
        import io
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    elif file.filename.endswith(".xlsx"):
        import io
        df = pd.read_excel(io.BytesIO(contents))
    else:
        return {"error": "Only CSV or XLSX files are allowed"}
    
    df = df.replace(np.nan, ' ', regex=True)   

    teachers = {}
    classeser = {}
    classes = {}
    subjects = {}
    # cta = ''
    tallotment = {}
    sallotment = {}

    import random
    # import pandas as pd

    class classTable:
        def __init__(self,row,col,av,tag):
            self.table = []
            self.entropy = []
            self.backtrack = []
            self.tag = tag
            self.av = av
            self.row = row
            self.col = col
            self.num = 0
            self.minEnt = 'und'
            for i in range(row):
                self.table.append([])
                self.entropy.append([])
                self.backtrack.append([])
                for j in range(col):
                    self.table[i].append(' ')
                    self.backtrack[i].append([])
                    self.entropy[i].append(list(self.av.keys()))


        def assign(self,i,j,t=False):
            global cta
            global maxL
            val = layout[i][j]
            indices = [j]
            f = True
            if val != '0':
                indices = []
                for k in range(len(layout[i])):
                    if layout[i][k] == val:
                        indices.append(k)

            if t:
                chosen = t
            else: 
                chosen = random.choice(self.entropy[i][j])
            for k in indices:
                teachers[chosen].assign(i,k,self.tag)

            if maxL == 'und' or maxL < len(self.entropy[i][j]):
                maxL = len(self.entropy[i][j])
            backtracking.append([[self.tag,chosen],[i,j],[len(self.entropy[i][j]),maxL]])
            for k in indices:


                self.table[i][k] = chosen
                self.num += 1

                self.av[chosen] -= 1

                cta = chosen
                if(self.av[chosen] == 0):
                    del self.av[chosen]
        
        def entropier(self):
            self.minEnt = 'und'
            opt = []
            for i in range(self.row):
                op = list(self.av.keys())
                cl = {}
                for j in range(self.col):
                    if self.table[i][j] in cl:
                        cl[self.table[i][j]] += 1
                    elif self.table[i][j] != ' ' and self.table[i][j] != '   ':
                        cl[self.table[i][j]] = 1

                mb = []
                bckup = list(op)
                for k in op:
                    if k not in cl and self.av[k] > 1:
                        mb.append(k)
                for j in range(self.col):
                    if(self.table[i][j] == ' '):
                        val = layout[i][j]
                        indices = [j]
                        if val != '0':
                            indices = []
                            for k in range(len(layout[i])):
                                if layout[i][k] == val:
                                    indices.append(k)
                        k = 0
                        op = list(self.av.keys())
                        if len(mb) > 0:
                            op = list(mb)
                            while k < len(op):
                                if teachers[op[k]].table[i][j] != ' ' or (op[k] in cl and (cl[op[k]] + len(indices)) > maxPeriod) or len(indices) > self.av[op[k]] or op[k] in self.backtrack[i][j]:
                                    op.pop(k)
                                    continue
                                k+=1
                        if len(op) == 0:
                            op = list(bckup)
                            k = 0
                        while k < len(op):
                            if teachers[op[k]].table[i][j] != ' ' or (op[k] in cl and (cl[op[k]] + len(indices)) > maxPeriod) or len(indices) > self.av[op[k]] or op[k] in self.backtrack[i][j]:
                                op.pop(k)
                            else:
                                k+=1
                        self.entropy[i][j] = op
                        if(self.minEnt == 'und' or len(op) < self.minEnt[0]):
                            self.minEnt = [len(op),i,j]
                            opt = []
                        elif(len(op) == self.minEnt[0]):
                            opt.append([len(op),i,j])
            if len(opt) > 0:
                self.minEnt = random.choice(opt)

    class teacherTable:
        def __init__(self,row,col,tag):
            self.table = []
            self.tag = tag

            self.row = row
            self.col = col

            for i in range(row):
                self.table.append([])
                for j in range(col):
                    self.table[i].append(' ')


        def assign(self,i,j,t):
            val = layout[i][j]
            indices = [j]
            if val != '0':
                indices = []
                for k in range(len(layout[i])):
                    if layout[i][k] == val:
                        indices.append(k)

            chosen = t
            for k in indices:
                if self.table[i][k] == ' ':
                    self.table[i][k] = chosen


    def findMin():
        ind = 'und'
        opt = []
        for k,v in classes.items():
            if(v.minEnt != 'und'): 
                if(ind == 'und' or ind[0][0] > v.minEnt[0]):
                    ind = [v.minEnt,k]
                    opt = []
                elif(ind[0][0] == v.minEnt[0] and ind[0][0] != 0):
                    opt.append([v.minEnt,k])


        if(ind == 'und'):
            return 0
            
        if len(opt) > 0:
            ind = opt[0]

        if ind[0][0] == 0:
            if classes[ind[1]].table[ind[0][1]][ind[0][2]] == ' ':
                classes[ind[1]].table[ind[0][1]][ind[0][2]] = '   '

                classes[ind[1]].entropier()
                backtracking.append([' ',ind])
        else:
            if classes[ind[1]].table[ind[0][1]][ind[0][2]] == ' ':
                classes[ind[1]].assign(ind[0][1],ind[0][2])
        return 1

    def main():
        global cta
        global maxL
        maxL = 'und'
        num = 0
        loop = 1
        idkC = 0
        cta = ''
        ansTeach = {}
        ansClass = {}
        while loop < 5000000:
            over= entropying(loop)
            val = findMin()
            if val == 0:
                print('idk')
                idkC += 1
                if idkC > 100:
                    return {'error':'NOT POSSIBLE'}
            loop += val
            bck,np = backtrCheck()


            if np:
                print('NOPE')
                return {'error':'NOT POSSIBLE'}
            if over:
                break
        else:
            print(len(backtracking))
        for i in classes:
            tt = []
            for j in range(classes[i].row):
                tt.append([])
                for k in range(classes[i].col):
                    if classes[i].table[j][k] in subjects:
                        tt[j].append(subjects[classes[i].table[j][k]])
                    else:
                        tt[j].append('   ')
            ansClass[i] = list(tt)
            num += classes[i].num



        for i in teachers:
            ansTeach[i] = teachers[i].table

        ansTeach = dict(sorted(ansTeach.items()))
        ansClass = dict(sorted(ansClass.items()))
        return {'error':0,'techers':ansTeach,'classes':ansClass,'subjects':subjects, 'studallotment':sallotment, 'teallotment':tallotment}




    def entropying(l=False):
        global cta
        if len(cta) > 0:
            for i in tallotment[cta]:
                classes[i[1]].entropier()
            cta = ''
        elif l == 1:
            for i in classes:
                classes[i].entropier()
        over = True
        for i in classes:
            if len(classes[i].av) != 0:
                over = False
        return over

                

    def backtrCheck():
        global cta
        global maxL
        t = False
        np = False
        c = 0

        for i in classes:
            o = classes[i]
            if len(o.av) != 0:
                t = True
                for j in range(o.row):
                    for k in range(o.col):
                        if len(o.entropy[j][k]) > 0 and o.table[j][k] == ' ':
                            t = False

                if t:

                    j = -1
                    while len(backtracking) > 0:
                        if backtracking[j][0] == ' ':
                            ind = backtracking[j][1]
                            classes[ind[1]].table[ind[0][1]][ind[0][2]] = ' '
                            classes[ind[1]].backtrack[ind[0][1]][ind[0][2]] = []
                            backtracking.pop()
                        elif backtracking[j][2][0] != backtracking[j][2][1] : 
                            indI,indJ = backtracking[j][1][0],backtracking[j][1][1]
                            val = layout[indI][indJ]
                            indices = [indJ]
                            if val != '0':
                                indices = []
                                for k in range(len(layout[indI])):
                                    if layout[indI][k] == val:
                                        indices.append(k)
                            # va = -1
                            for k in indices:
                                # if backtracking[j][2][0] != backtracking[j][2][1] : 
                                classes[backtracking[j][0][0]].backtrack[indI][k] = []
                                if classes[backtracking[j][0][0]].table[indI][k] in classes[backtracking[j][0][0]].av:
                                    classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][k]] += 1
                                else:
                                    classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][k]] = 1
                                teachers[backtracking[j][0][1]].table[indI][k] = ' '
                                classes[backtracking[j][0][0]].table[indI][k] = ' '
                                    # backtracking.pop(va)
                            # if va == -1:
                            cta = backtracking[j][0][1]
                            entropying()
                            backtracking.pop()
                        else:
                            indI,indJ = backtracking[j][1][0],backtracking[j][1][1]
                            val = layout[indI][indJ]
                            indices = [indJ]
                            if val != '0':
                                indices = []
                                for k in range(len(layout[indI])):
                                    if layout[indI][k] == val:
                                        indices.append(k)

                            if len(indices) > 1:
                                for k in indices:
                                    # indI,indJ = backtracking[va][1][0],backtracking[va][1][1]
                                    if k != indJ: 
                                        classes[backtracking[j][0][0]].backtrack[indI][k] = []
                                        if classes[backtracking[j][0][0]].table[indI][k] in classes[backtracking[j][0][0]].av:
                                            classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][k]] += 1
                                        else:
                                            classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][k]] = 1
                                        teachers[backtracking[j][0][1]].table[indI][k] = ' '
                                        classes[backtracking[j][0][0]].table[indI][k] = ' '
                                        # backtracking.pop(va)

                            # entropying()
                            # print(backtracking[-1])
                            if teachers[backtracking[j][0][1]].table[indI][indJ] != ' ' and classes[backtracking[j][0][0]].table[indI][indJ] != ' ':
                                classes[backtracking[j][0][0]].backtrack[indI][indJ].append(backtracking[j][0][1])
                                if classes[backtracking[j][0][0]].table[indI][indJ] in classes[backtracking[j][0][0]].av:
                                    classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][indJ]] += 1
                                else:
                                    classes[backtracking[j][0][0]].av[classes[backtracking[j][0][0]].table[indI][indJ]] = 1
                                teachers[backtracking[j][0][1]].table[indI][indJ] = ' '
                                cta = backtracking[j][0][1]
                                appe = False
                                for i in tallotment[cta]:
                                    if classes[i[1]].table[indI][indJ] == '   ' and classes[backtracking[j][0][0]].table[indI][indJ] in classes[i[1]].av:
                                        classes[i[1]].table[indI][indJ] = classes[backtracking[j][0][0]].table[indI][indJ]
                                        if maxL < len(classes[i[1]].entropy[indI][indJ]):
                                            maxL = len(classes[i[1]].entropy[indI][indJ])
                                        appe = [[i[1],classes[backtracking[j][0][0]].table[indI][indJ]],[indI,indJ],[len(classes[i[1]].entropy[indI][indJ]),maxL]]
                                        print('HAHAHA')
                                classes[backtracking[j][0][0]].table[indI][indJ] = ' '
                                classes[backtracking[j][0][0]].num -= 1
                                entropying()


                                if len(classes[backtracking[j][0][0]].entropy[indI][indJ]) == 0:
                                    classes[backtracking[j][0][0]].backtrack[indI][indJ] = []

                                    classes[backtracking[j][0][0]].entropier()

                                    backtracking.pop()
                                    if appe:
                                        backtracking.append(appe)

                                    # print(len(backtracking),cta,'yes')


                                    continue

                                df = backtracking.pop()
                                if appe:
                                    backtracking.append(appe)
                                classes[df[0][0]].assign(df[1][0],df[1][1])



                                return t,np
                            else:
                                backtracking.pop()
            else:
                c += 1
        # print(c)
        return t,np
            
    backtracking = []
    cv = False
    sb = False

    # print(df)
    tm = 0
    tc = 0
    c = {}
    for value1, value2, value3, value4 in zip(df['Teacher'], df['Classes'], df['Periods'], df['Subject']):
        # cv = False
        if value1 != ' ':
            cv = value1
            sb = value4
            teachers[cv] = teacherTable(row,coloumn,cv)
            subjects[cv] = value4
            tm = max(tm,tc)
            tc = 0
            
        if cv:
            if value2 in classeser:
                classeser[value2][cv] = value3
            else:
                classeser[value2] = {cv : value3}
            if cv in tallotment:
                tallotment[cv].append([sb,value2])
            else:
                tallotment[cv] = [[sb,value2]]
            if value2 in sallotment:
                sallotment[value2].append([sb,cv])
            else:
                sallotment[value2] = [[sb,cv]]
            tc += value3
            if value2 in c:
                c[value2] += 1
            else:
                c[value2] = 1
    if tm > cols*rows or max(c.values()) > cols*rows:
        return {'error':"SUFFICIENT PERIODS NOT PROVIDED"}
            
    # print(allotment)
    ls = 0
    for i in range(len(layout)):
        d = {'0':0}
        for j in range(len(layout[i])):
            if layout[i][j] != '0':
                if layout[i][j] in d:
                    d[layout[i][j]] += 1
                else:
                    d[layout[i][j]] = 1
        ls = max(ls,max(d.values()))
    # print(ls)
    if ls > maxPeriod:
        return {'error':"GIVE LAYOUT ACCORDING TO THE GIVEN CONSTRAINTS"}

    for k,v in classeser.items():
        classes[k] = classTable(row,coloumn,v,k)

    # print(teachers,classes,subjects)


    
    return main()

    
    

    
    
    # print(sallotment)
    