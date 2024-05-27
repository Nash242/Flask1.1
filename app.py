#these three lines swap the stdlib sqlite3 lib with the pysqlite3 package
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')

from flask import Flask, render_template, request, jsonify
from langchain.chains.question_answering import load_qa_chain
import os, re
from langchain.document_loaders import Docx2txtLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from sentence_transformers import CrossEncoder
from langchain.document_loaders import PyPDFLoader
import csv
import time
from langchain.document_loaders import CSVLoader
import pandas as pd

app = Flask(__name__)

os.environ["OPENAI_API_KEY"] = ""
llm_model = "gpt-3.5-turbo"
llm = ChatOpenAI(temperature=0.1, model=llm_model)
embeddings = OpenAIEmbeddings()
directory1_path = "temp_csv"

#======================================= CSV ========================================================

quest1 = []
ans1 = []

def load_csv(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path) and file_path.endswith(".csv"):
            loader = CSVLoader(file_path, encoding="latin1")
            data_csv = loader.load()
            for page in data_csv:
                question = page.page_content.split("\n")[1]
                quest1.append(question)
                ans = page.page_content.split("\n")[2]
                ans1.append(ans)
            return quest1,ans1
        else:
            pass

def get_text_chunks_csv(quest1):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=200,
        length_function=len,
        separators=['\nQ','\n\n','\n']
    )
    csv_chunk = text_splitter.create_documents(quest1)
    #print(csv_chunk)
    return csv_chunk

def embed_metadata(csv_chunk, ans1):
    for chunk, answer in zip(csv_chunk, ans1):
        chunk_metadata = {"answer": answer}
        chunk.metadata = chunk_metadata
    return csv_chunk

def intent_main(folder_path):
    quest_intent, ans_intent = load_csv(folder_path)
    csv_chunk = get_text_chunks_csv(quest_intent)
    chunk_metadata = embed_metadata(csv_chunk, ans_intent)
    return chunk_metadata

def vector_intent(chunk_metadata):
    retriever_csv = Chroma.from_documents(documents=chunk_metadata, embedding=embeddings, persist_directory=directory1_path)
    retriever_csv.persist()
    vectordb = Chroma(persist_directory=directory1_path, embedding_function=embeddings)
    return vectordb

#======================================= PDF ==========================================================
def load_pdf(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path) and file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
            pages = loader.load_and_split()
            return pages

def list1(pages):
    l1 = []
    for i in pages:
        data = i.page_content
        l1.append(data)
    #print(l1)
    return l1

def fetch_questions(l1):
    questions = []
    pattern = r'Q\d+\..*?\?'

    # Extract questions
    for text in l1:
        matches = re.findall(pattern, text, re.DOTALL)
        questions.extend(matches)

    return questions

def get_pdf_chunks(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=20,
        length_function=len,
        separators=['\nQ','\n\n','\n']
    )
    chunks = text_splitter.create_documents(documents)
    #print(chunks)
    return chunks

def fetch_answers(l1):
    pattern = r'Answer:.*?(?=Q\d+\.|$)'
    answers = []

    # Extract answers
    for text in l1:
        matches = re.findall(pattern, text, re.DOTALL)
        answers.extend(matches)

    return answers

def m_chunks(chunks, answers):
    for chunk, answer in zip(chunks, answers):
        chunk_metadata = {"answer": answer}
        chunk.metadata = chunk_metadata
    return chunks

def persist(chunks, user_question):
    embeddings = OpenAIEmbeddings()
    persist_directory = "temp"
    retriever2 = Chroma.from_documents(documents=chunks, embedding=embeddings, persist_directory=persist_directory)
    retriever2.persist()
    quest = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    return quest

def rerank_top_n(query,output,n_chunks):
    # model = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2', max_length=512)
    model = CrossEncoder("C:\\Users\\nimis\\Downloads\\Cross_encoder")
    input_lst=[]
    for chunk in output:
        tup=(query,chunk.page_content)
        input_lst.append(tup)
    if len(input_lst) == 0:
        return []
    scores = model.predict(input_lst)
    total_data=zip(output,scores)
    reranked = sorted(total_data, key=lambda x: x[1],reverse=True)
    try:
        return reranked[:n_chunks]
    except:
        print(f"Value of n_chunks is greater than the number of input chunks. Reduce the number of n_chunks.")
        return reranked


#================================= Text File =====================================================

def load_docs(folder_path):
    documents = []
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        print(os.listdir(folder_path))
        if os.path.isfile(file_path) and file_path.endswith(".txt"):
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
                documents.append(content)
    return documents


def split_docs(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=100,
        length_function=len
    )
    chunks = text_splitter.create_documents(documents)
    return chunks


def create_vectors(persist_directory, directory, docs):
    embeddings = OpenAIEmbeddings()
    processed_files = {}
    processed_files_path = "processed.txt"
    
    if os.path.exists(persist_directory):
        if os.path.exists(processed_files_path):
            with open(processed_files_path, "r") as file:
                for line in file:
                    file_name, modification_time = line.strip().split(":")
                    processed_files[file_name] = float(modification_time)

        current_files = os.listdir(directory)
        new_files = []
        for file in current_files:
            file_path = os.path.join(directory, file)
            if file not in processed_files or os.path.getmtime(file_path) > processed_files[file]:
                new_files.append(file)

        if new_files:
            print("New or modified files detected:", new_files)
            documents = load_docs(directory)
            docs = split_docs(documents)

            # Create or fetch Chroma vector database
            vectors = Chroma.from_documents(documents=docs, embedding=embeddings, persist_directory=persist_directory)
            vectors.persist()
            vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)

            # Update processed files list with modification times
            with open(processed_files_path, "w") as file:
                for file_name in new_files:
                    file_path = os.path.join(directory, file_name)
                    modification_time = os.path.getmtime(file_path)
                    processed_files[file_name] = modification_time
                    file.write(f"{file_name}:{modification_time}\n")

            return vectordb
        else:
            print("No new or modified files detected. Using existing vector database.")
            vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
            return vectordb
    else:
        vectordb = Chroma(persist_directory=persist_directory, embedding_function=embeddings)
        
        # Create and initialize processed.txt
        with open(processed_files_path, "w") as file:
            file.write("")
        
        return vectordb

def prompt_txt():
    prompt_file_path = "prompt.txt"
    with open(prompt_file_path, 'r') as file:
        prompt = file.read()
    return prompt
#=================================== One time Run ========================================================== 
directory = "contents"
persist_directory = "chroma_db"    
documents = load_docs(directory)
docs = split_docs(documents)
vectordb = create_vectors(persist_directory, directory, docs)
print("Vector db created")
intent_chunks = intent_main(directory)
intent_db = vector_intent(intent_chunks)
#print("IntentDB hit")


#============================================= Flask Functions ===========================================
# Route for GET requests
@app.route('/', methods=['GET','POST'])
def get_route():
    return render_template('index.html')

@app.route('/config')
def geturl():
    return render_template('url.html')

@app.route('/getprompt', methods=['POST','GET'])
def getprompt():
    if request.method == 'GET':
        return render_template('prompt.html')
    
@app.route('/sendprompt', methods=['POST','GET'])
def sendprompt():
    try :
        if request.method == 'GET':
            text_file_path = os.path.join(app.root_path, 'prompt.txt')
            with open(text_file_path, 'r') as file:
                content = file.read()
            return jsonify(mdata=content,msg='success')
    except Exception as e:
        print(e)
        return jsonify(data=e,msg='fail')
    
@app.route('/updateprompt', methods=['POST','GET'])
def updateprompt():
    try :
        if request.method == 'POST':
            data=request.form['prompt']
            print(data)
            with open('prompt.txt', 'w') as file:
                file.write(data)
            return jsonify({"mdata":data,"msg":"success"})
    except Exception as e:
        print(e)
        return jsonify({"mdata":e,"msg":"fail"})

    
@app.route('/getpositivefeedback', methods=['POST','GET'])
def getpositivefeedback():
    if request.method == 'GET':
        return render_template('positivefeedback.html')

@app.route('/positivefeedback', methods=['POST','GET'])
def positivefeedback():
    try :
        if request.method == 'GET':
            tdata =pd.read_csv('thumbs_up_log.csv').to_json(orient='records')
            return jsonify({'tdata':tdata,'msg':'success'})
    except Exception as e :
        print(e)
        return jsonify({'tdata':e,'msg':'fail'})

@app.route('/getnegativefeedback', methods=['POST','GET'])
def getnegativefeedback():
    if request.method == 'GET':
        return render_template('negativefeedback.html') 

@app.route('/negativefeedback', methods=['POST','GET'])
def negativefeedback():
    try:
        if request.method == 'GET':
            tdata =pd.read_csv('thumbs_down_log.csv').to_json(orient='records')
            return jsonify({'tdata':tdata,'msg':'success'}) 
    except Exception as e :
        print(e)
        return jsonify({'tdata':e,'msg':'fail'})

@app.route('/getintent', methods=['POST','GET'])
def getintent():
    if request.method == 'GET':
        return render_template('intent.html')

@app.route('/intent', methods=['POST','GET'])
def intent():
    try:
        if request.method == 'POST':
            contents_folder = os.path.join(app.root_path, 'contents')
            files = request.files.getlist('files')
            for file in files :
                file_path = os.path.join(contents_folder, file.filename)
                print(file_path)
                file.save(file_path)
            return jsonify({'msg':'success'})
    except Exception as e :
        print(e)
        return jsonify({'mdata':e,'msg':'fail'})

@app.route('/submitticket', methods=['POST','GET'])
def submitticket():
    try :
        if request.method == 'POST':
            form_data = {}
            for key, value in request.form.items():
                form_data[key] = value
            print(form_data)
            return jsonify({"msg":"success","tdata":form_data})
    except Exception as e :
        print(e)
        return jsonify({"msg":"fail","data":e})

@app.route('/getanswer', methods=['POST','GET'])
def post_route():
    try:
        if request.method == 'POST':
            que=request.form['question']
            print(que)
            data=runmain(que)
            print(20*'-')
            print(data)
            return jsonify({'message': data, "status":"success"})
    except Exception as e:
        return jsonify({'message': e, "status":"fail"})


@app.route('/dislikeresponse', methods=['POST'])
def write_to_first_csv():
    print('dislike running')
    usermassage = request.form['usermassage']
    botresponse = request.form['botresponse']
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    csv_file_path = "thumbs_down_log.csv"
    file_exists = os.path.isfile(csv_file_path)
    with open(csv_file_path, mode='a', newline='', encoding='utf-8') as f:
        fieldnames = ['Timestamp', 'Question', 'Answer']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
    with open(csv_file_path, mode='a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow({'Timestamp': timestamp, 'Question': usermassage, 'Answer': botresponse})
    return jsonify({'msg':'success'})

@app.route('/likeresponse', methods=['POST'])
def write_to_second_csv():
    print('like running')
    usermassage = request.form['usermassage']
    #print(usermassage,20*"=")
    botresponse = request.form['botresponse']
    #print(30*"*",botresponse)
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    #print("#"*30,timestamp)
    csv_file_path = "thumbs_up_log.csv"
    file_exists = os.path.isfile(csv_file_path)
    with open(csv_file_path, mode='a', newline='', encoding='utf-8') as f:
        fieldnames = ['Timestamp', 'Question', 'Answer']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
    with open(csv_file_path, mode='a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerow({'Timestamp': timestamp, 'Question': usermassage, 'Answer': botresponse})
    return jsonify({'msg':'success'})


@app.route('/getdashboard', methods=['POST','GET'])
def getdashboard():
    try :
        if request.method == 'GET':
            tdata =pd.read_excel("Dashboard.xlsx") #.to_json(orient='records')
            dash = tdata.to_dict('list')
            result = {dash['Updation_date'][i].strftime('%Y-%m-%d'): dash['Dashboard'][i].split(", ") for i in range(len(dash['Dashboard']))}
            print(result)
            return jsonify({"msg":"success","tdata":result})
    except Exception as e :
        print(e)
        return jsonify({"msg":"fail","data":e})

#====================================== Main Function call ==================================================================
def runmain(user_que):
    print('in runMAIN')
    user_question =user_que #user input
    if user_question:
        if (user_question.lower().strip() in ['hi','hello','good morning','good afternoon','good evening','Hi']):
            answer = "Hello! How can I Help you?"
            return answer
        
        elif (os.path.isdir(directory1_path)):
            db3 = Chroma(persist_directory=directory1_path, embedding_function=embeddings)
            quest = db3.similarity_search(user_question,k=3)
            #print(quest)
            top = rerank_top_n(user_question,quest,3)
            #print("======================",top)
            if top[0][1]*10 > 60:
                return top[0][0].metadata["answer"]
            else:
                matching_docs = vectordb.similarity_search(user_question, k=3)
                print("======================================================")
                print(matching_docs)
                print("======================================================")
                top1 = rerank_top_n(user_question,matching_docs,3)
                #print(top1)
                prompt = f"""{prompt_txt()} 
                \nQuestion: {user_question}
                \nContext:{top1}
                \nAnswer: """
            
                print(prompt)
                answer = llm.invoke(prompt)
                
                return answer.content
        else:
            return "Answer not found. Please Rephrase the question?"



if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        print(e)
